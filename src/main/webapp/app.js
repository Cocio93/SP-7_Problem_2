var app = angular.module('examApp', [])
    .controller('ExamController', ['$scope', 'StudentFactory', function ($scope, StudentFactory) {

        $scope.studentsInfo = StudentFactory.studentsInfo;
        console.log($scope.studentsInfo);

        $scope.getStudentGrades = function () {
            StudentFactory.getStudentGrades()
                .then(function (response) {
                    //$scope.studentsInfo = response;
                }, function (response) {
                    //toast('Something went terribly wrong','Oops!');
                });
        }
    }]);

app.factory('StudentFactory', ['$http', '$q', function ($http, $q) {

    var studentsInfo = {};

    studentsInfo.allcourses = [
        {courseId: 1000, courseName: "Basic Programming"},
        {courseId: 1001, courseName: "Advanced Programming"},
        {courseId: 1003, courseName: "DataBase Intro"}];
    
    studentsInfo.students = [];
    studentsInfo.students.push({studentId: 100, name: "Peter Hansen", grades: [{grade: "10"}, {grade: "12"}, {}]});
    studentsInfo.students.push({studentId: 101, name: "Jan Olsen", grades: [{grade: "7"}, {grade: "10"}, {}]});
    studentsInfo.students.push({studentId: 102, name: "Gitte Poulsen", grades: [{grade: "7"}, {grade: "7"}, {}]});
    studentsInfo.students.push({studentId: 103, name: "John McDonald", grades: [{grade: "10"}, {}, {grade: "7"}]});

    var getStudentGrades = function () {
        var q = $q.defer();
        $http.get("the-get-student-grades-url")
            .then(function (response) {
                q.resolve(response.data);
            }, function (response) {
                q.reject(response);
            });
        return q.promise;
    };

    return {
        studentsInfo: studentsInfo,
        getStudentGrades: getStudentGrades
    };
}]);

app.directive('studentGrades', function () {
    return {
        restrict: 'AE',
        templateUrl: 'student-grades.html'
    }
});

app.filter('average', [function () {
    return function (input) {
        var result = [];
        var num = 0;

        angular.forEach(input, function (student) {
            student.average = 0;
            
            for (var i = 0; i < student.grades.length; i++) {

                if (!angular.equals(student.grades[i], {})) {
                    num++;
                    student.average += parseInt(student.grades[i].grade);
                }
            }
            student.average = (student.average) / num;

            result.push(student);
        });

        return result;
    };
}]);