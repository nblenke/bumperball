game.scoreboard = function () {
    var rootRef = new Firebase('https://nblenke.firebaseio.com/bumperball/scoreboard');
    var scoreListRef = rootRef.child("scoreList");
    var highestScoreRef = rootRef.child("highestScore");

    // Keep a mapping of firebase locations to HTML elements, so we can move / remove elements as necessary.
    var htmlForPath = {};

    // Helper function that takes a new score snapshot and adds an appropriate row to our leaderboard table.
    function handleScoreAdded(scoreSnapshot, prevScoreName) {
        var newScoreRow = $("<tr></tr>");
        newScoreRow.append($("<td></td>").append($("<span></span>").text(scoreSnapshot.val().name)));
        newScoreRow.append($("<td></td>").text(scoreSnapshot.val().score));

        // Store a reference to the table row so we can get it again later.
        htmlForPath[scoreSnapshot.name()] = newScoreRow;

        // Insert the new score in the appropriate place in the table.
        if (prevScoreName === null) {
            $("#leaderboardTable").append(newScoreRow);
        } else {
            var lowerScoreRow = htmlForPath[prevScoreName];
            lowerScoreRow.before(newScoreRow);
        }
        $('#scoreboard .load').hide();
    }

    // Helper function to handle a score object being removed; just removes the corresponding table row.
    function handleScoreRemoved(scoreSnapshot) {
        var removedScoreRow = htmlForPath[scoreSnapshot.name()];
        removedScoreRow.remove();
        delete htmlForPath[scoreSnapshot.name()];
    }

    // Create a view to only receive callbacks for the selected leaderboard size
    var scoreListView = scoreListRef.limit(game.cfg.leaderboard_size);

    // Add a callback to handle when a new score is added.
    scoreListView.on('child_added', function (newScoreSnapshot, prevScoreName) {
        handleScoreAdded(newScoreSnapshot, prevScoreName);
    });

    // Add a callback to handle when a score is removed
    scoreListView.on('child_removed', function (oldScoreSnapshot) {
        handleScoreRemoved(oldScoreSnapshot);
    });

    // Add a callback to handle when a score changes or moves positions.
    var changedCallback = function (scoreSnapshot, prevScoreName) {
        handleScoreRemoved(scoreSnapshot);
        handleScoreAdded(scoreSnapshot, prevScoreName);
    };
    scoreListView.on('child_moved', changedCallback);
    scoreListView.on('child_changed', changedCallback);

    // form
	$('.inputWrap input').on('keyup', function () {
        if ($(this).val() === '') {
            $(this).addClass('invalid');
        } else {
            $(this).removeClass('invalid');
            $(this).next('input').focus();
        }
	});
    $('#post_score').click(function (event) {
        var newScore = Number(opt.SCORE),
            proceedVal = 0,
            userName = $("#nameInput0").val() +  $("#nameInput1").val() +  $("#nameInput2").val();

		$('.inputWrap input').each(function () {
            if ($(this).val().length) {
                proceedVal += 1;
            }
        });

        if (proceedVal === 3) {
			$('.menu').hide();
			$('#scoreboard').show();

			var userScoreRef = scoreListRef.child(userName);

			// set priority by score
			userScoreRef.setWithPriority({
				name: userName, 
				score: newScore,
				level: Number(opt.LEVEL),
				lost: Number(opt.LOST_COUNT),
				saved: Number(opt.SAVED)
			}, newScore);

			// Track the highest score using a transaction.
			highestScoreRef.transaction(function (currentHighestScore) {
				if (currentHighestScore === null || newScore > currentHighestScore) {
					// The return value of this function gets saved to the server as the new highest score.
					return newScore;
				}
				// if we return with no arguments, it cancels the transaction.
				return;
			});
		} else {
			$('.inputWrap input').each(function () {
                if ($(this).val() === '') {
                    $(this).addClass('invalid');
                } else {
                    $(this).removeClass('invalid');
                }
            });
		}
    });

    // Add a callback to the highest score in Firebase so we can update the GUI any time it changes.
    highestScoreRef.on('value', function (newHighestScore) {
        $("#highestScoreDiv").text(newHighestScore.val());
    });

}

