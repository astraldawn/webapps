/**
 * Created by mark on 28/05/16.
 */

ChronoCtrl.$inject = ['$scope', 'chronodatas'];

angular.module('webapps')
    .controller('ChronoCtrl', ChronoCtrl);

function ChronoCtrl($scope, chronodatas) {
    $scope.chronodatas = chronodatas.chronodatas;

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

        obj.media.url = "//logo.clearbit.com/" + title + ".com?size=150";

        obj.text.headline = data[i].Title;
        obj.text.text = data[i].Description;

        obj.start_date.year = date.getFullYear();
        obj.start_date.month = date.getMonth() + 1;
        obj.start_date.day = date.getDate();

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