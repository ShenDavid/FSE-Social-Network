'use strict';

angular.module('esnApp').controller('MailCtrl', function($scope, $stateParams, MailService, AuthService, mySocket, Notification) {
    $scope.currentUser = AuthService.getUser().username;
    $scope.activeTab = "inbox";
    $scope.targetName = $stateParams.target;
    $scope.isPopupVisible = false;
    $scope.isComposePopupVisible = false;
    $scope.composeEmail = {};
    $scope.sentEmails = [];

    $scope.showInbox = function() {
        $scope.activeTab = "inbox";
        $scope.isPopupVisible = false;
        $scope.isComposePopupVisible = false;
    }
    $scope.showSent = function() {
        $scope.activeTab = "sent";
        $scope.isPopupVisible = false;
        $scope.isComposePopupVisible = false;
    }
    $scope.showComposePopup = function() {
        $scope.composeEmail = {};
        $scope.isComposePopupVisible = true;
        $scope.isPopupVisible = false;
    };

    $scope.closeComposePopup = function() {
        $scope.isComposePopupVisible = false;
    };

    $scope.showPopup = function(email) {
        $scope.isPopupVisible = true;
        $scope.isComposePopupVisible = false;
        $scope.selectedEmail = email;
    };

    $scope.closePopup = function() {
        $scope.isPopupVisible = false;
    };
    $scope.delete = function(email) {
        MailService.deleteMail($scope.selectedEmail.from, $scope.selectedEmail.to, $scope.selectedEmail.subject, $scope.selectedEmail.body);
        $scope.isPopupVisible = false;
        Notification.success("Mail deleted!");
        var index = 0;
        if ($scope.activeTab === "inbox") {
            index = $scope.emails.indexOf($scope.selectedEmail);
            $scope.emails.splice(index, 1);
        } else {
            index = $scope.sentEmails.indexOf($scope.selectedEmail);
            $scope.sentEmails.splice(index, 1);
        }
        $scope.isPopupVisible = false;
    };

    $scope.sendEmail = function() {
        console.log($scope.currentUser);

        MailService.addMail($scope.currentUser, $scope.composeEmail.to, $scope.composeEmail.subject, $scope.composeEmail.body);
        $scope.isComposePopupVisible = false;
        $scope.composeEmail.from = "me";
        $scope.composeEmail.date = new Date();
        $scope.sentEmails.splice(0, 0, $scope.composeEmail);
        Notification.success("Send mail to " + $scope.composeEmail.to + " successfully!");
    };

    $scope.forward = function() {
        $scope.isPopupVisible = false;
        $scope.composeEmail = {};
        angular.copy($scope.selectedEmail, $scope.composeEmail);

        $scope.composeEmail.body =
            "\n-------------------------------\n" +
            "from: " + $scope.composeEmail.from + "\n" +
            "sent: " + $scope.composeEmail.date + "\n" +
            "to: " + $scope.composeEmail.to + "\n" +
            "subject: " + $scope.composeEmail.subject + "\n" +
            $scope.composeEmail.body;

        $scope.composeEmail.subject = "FW: " + $scope.composeEmail.subject;
        $scope.composeEmail.to = "";
        $scope.composeEmail.from = "me";
        $scope.isComposePopupVisible = true;
    };

    $scope.reply = function() {
        $scope.isPopupVisible = false;
        $scope.composeEmail = {};
        angular.copy($scope.selectedEmail, $scope.composeEmail);
        $scope.composeEmail.body =
            "\n-------------------------------\n" +
            "from: " + $scope.composeEmail.from + "\n" +
            "sent: " + $scope.composeEmail.date + "\n" +
            "to: " + $scope.composeEmail.to + "\n" +
            "subject: " + $scope.composeEmail.subject + "\n" +
            $scope.composeEmail.body;

        $scope.composeEmail.subject = "RE: " + $scope.composeEmail.subject;
        $scope.composeEmail.to = $scope.composeEmail.from;
        $scope.composeEmail.from = "me";
        $scope.isComposePopupVisible = true;
    };
    $scope.emails = [];
    MailService.findInMails($scope.currentUser).then(function(mails) {
        $scope.emails = mails.reverse();
    }, function(err) {
        console.log(err);
    });
    MailService.findSentMails($scope.currentUser).then(function(mails) {
        $scope.sentEmails = mails.reverse();
    }, function(err) {
        console.log(err);
    });
});
