/**
 * Created by mark on 28/05/16.
 */

ChronoCtrl.$inject = ['$scope', 'chronodatas'];

angular.module('webapps')
    .controller('ChronoCtrl', ChronoCtrl);

function ChronoCtrl($scope, chronodatas) {
    $scope.chronodatas = chronodatas.chronodatas;

    var timeline_test_json = {
        "title": {
            "media": {
                "url": "//www.flickr.com/photos/tm_10001/2310475988/",
                "caption": "Whitney Houston performing on her My Love is Your Love Tour in Hamburg.",
                "credit": "flickr/<a href='http://www.flickr.com/photos/tm_10001/'>tm_10001</a>"
            },
            "text": {
                "headline": "Whitney Houston<br/> 1963 - 2012",
                "text": "<p>Houston's voice caught the imagination of the world propelling her to superstardom at an early age becoming one of the most awarded performers of our time. This is a look into the amazing heights she achieved and her personal struggles with substance abuse and a tumultuous marriage.</p>"
            }
        },
        "events": [
            {
                "media": {
                    "url": "{{ static_url }}/img/examples/houston/family.jpg",
                    "caption": "Houston's mother and Gospel singer, Cissy Houston (left) and cousin Dionne Warwick.",
                    "credit": "Cissy Houston photo:<a href='http://www.flickr.com/photos/11447043@N00/418180903/'>Tom Marcello</a><br/><a href='http://commons.wikimedia.org/wiki/File%3ADionne_Warwick_television_special_1969.JPG'>Dionne Warwick: CBS Television via Wikimedia Commons</a>"
                },
                "start_date": {
                    "month": "8",
                    "day": "9",
                    "year": "1963"
                },
                "text": {
                    "headline": "A Musical Heritage",
                    "text": "<p>Born in New Jersey on August 9th, 1963, Houston grew up surrounded by the music business. Her mother is gospel singer Cissy Houston and her cousins are Dee Dee and Dionne Warwick.</p>"
                }
            },
            {
                "media": {
                    "url": "https://youtu.be/fSrO91XO1Ck",
                    "caption": "",
                    "credit": "<a href=\"http://unidiscmusic.com\">Unidisc Music</a>"
                },
                "start_date": {
                    "year": "1978"
                },
                "text": {
                    "headline": "First Recording",
                    "text": "At the age of 15 Houston was featured on Michael Zager's song, Life's a Party."
                }
            }
        ]
    };

    /* Data declaration */
    var timeline_json = {
        "title": {
            "text": {
                "headline": "test headline",
                "text": "test text"
            }
        },
        "events": []
    };

    var trace1 = {
        x: [],
        y: [],
        type: 'bar'
    };

    var data = $scope.chronodatas;
    var year_summary = {};

    /* Data processing */
    for (var i = 0; i < data.length; i++) {
        var cur = data[i];

        // Date
        var date = new Date(data[i].BreachDate);

        if (year_summary[date.getFullYear()]) {
            year_summary[date.getFullYear()] += data[i].Count;
        } else {
            year_summary[date.getFullYear()] = data[i].Count;
        }

        // Only interested in events that occur often
        if (data[i].Count < 5000000) continue;

        var obj = {"media": {}, "text": {}, "start_date": {}};

        var title = data[i].Title;
        title = title.toLowerCase().replace(/ /g, "");
        title = title.toLowerCase().replace(".com", "");

        obj.media["url"] = "//logo.clearbit.com/" + title + ".com?size=150";

        obj.text["headline"] = data[i].Title;
        obj.text["text"] = data[i].Description;

        obj.start_date["year"] = date.getFullYear();
        obj.start_date["month"] = date.getMonth() + 1;
        obj.start_date["day"] = date.getDate();

        timeline_json.events.push(obj);
    }

    for (var key in year_summary) {
        trace1.x.push(key);
        trace1.y.push(year_summary[key]);
    }


    /* Plot the timeline */
    window.timeline = new TL.Timeline('chrono-timeline', timeline_json);

    var display_1_data = [trace1];
    var layout = {
        title: "Yearly summary",
        hovermode: 'closest'
    };

    Plotly.newPlot('chrono-display-1', display_1_data, layout, {displayModeBar: false});

}