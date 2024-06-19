let stageHeight;
let stageWidth;
let renderer;

$(function () {
    renderer = $('#renderer');

    earthquakeData.forEach(function (item) {
        let dateParts = item["Date"].split(".");
        item["DAY"] = dateParts[0];
        item["MONTH"] = dateParts[1];
        let year = parseInt(dateParts[2]);
        if (year <= 99 && year >= 65) {
            year += 1900;
        } else if (year >= 0 && year <= 16) {
            year += 2000;
        }
        item["YEAR"] = year.toString();
    });

    tsunamiData = tsunamiData.filter(item => item.YEAR >= 1965 && item.YEAR <= 2016);
    tsunamiData.sort((a, b) => a.YEAR - b.YEAR);
});

$(function () {
    let stageHeight = $('#renderer').innerHeight();
    let stageWidth = $('#renderer').innerWidth();

    let filteredEarthquakeData = [];
    let filteredTsunamiData = [];

    filterData();

    $('#yearRange').on('input', function () {
        let selectedYear = $(this).val();
        $('#currentYear').text(selectedYear);
        displayEvents(selectedYear);
    });

    function filterData() {
        filteredEarthquakeData = earthquakeData.filter(earthquakeEvent => {
            let eventYear = parseInt(earthquakeEvent.YEAR);
            return eventYear >= 1965 && eventYear <= 2016;
        });

        filteredTsunamiData = tsunamiData.filter(tsunamiEvent => {
            let eventYear = parseInt(tsunamiEvent.YEAR);
            return eventYear >= 1965 && eventYear <= 2016;
        });
    }

    displayEvents(1965);

    function adjustDate(dateStr) {
        let [day, month, year] = dateStr.split('.');
        let yearNumber = parseInt(year, 10);
        if (yearNumber >= 65) {
            year = '19' + year;
        } else if (yearNumber <= 16) {
            year = '20' + year;
        } else {
            throw new Error('Year out of expected range');
        }
        return `${day}.${month}.${year}`;
    }

    function formatDate(day, month, year) {
        day = day.toString().padStart(2, '0');
        month = month.toString().padStart(2, '0');
        return `${day}.${month}.${year}`;
    }

    function displayEvents(selectedYear) {
        $('.dot, .dotTsu').remove();

        let matchingEvents = [];

        filteredEarthquakeData.forEach(earthquakeEvent => {
            if (earthquakeEvent.YEAR == selectedYear) {
                let correctedDate = adjustDate(earthquakeEvent.Date);
                let correctedTime = earthquakeEvent.Time.slice(0, 5);

                filteredTsunamiData.forEach(tsunamiEvent => {
                    let formattedDate = formatDate(tsunamiEvent.DAY, tsunamiEvent.MONTH, tsunamiEvent.YEAR);
                    let time = tsunamiEvent.HOUR + ":" + tsunamiEvent.MINUTE;

                    if (correctedDate === formattedDate && correctedTime === time) {
                        matchingEvents.push({ earthquakeEvent, tsunamiEvent });
                    }
                });
            }
        });

        let x = 0;
        const step = 50;
        const yOffset = 20;

        matchingEvents.forEach(eventPair => {
            const { earthquakeEvent, tsunamiEvent } = eventPair;

            let dotEq = $('<div></div>');
            dotEq.attr('earthquakeEvent', earthquakeEvent.Magnitude);
            dotEq.attr('year', earthquakeEvent.YEAR);
            dotEq.addClass('dot');
            dotEq.css({
                'height': 10,
                'width': 10,
                'left': x,
                'top': stageHeight / 2 + yOffset,
                'background-color': 'red'
            });
            $('#renderer').append(dotEq);

            dotEq.hover(function (event) {
                var box = $('<div class="earthquakeBox"></div>');
                var magnitude = earthquakeEvent.Magnitude;
                var date = earthquakeEvent.Date;
                var time = earthquakeEvent.Time;
                var correctedDate = adjustDate(date);
                var correctedTime = time.slice(0, 5);
                box.html("<b>Date:</b> " + correctedDate + "<br><b>Time: </b>" + correctedTime + "<br><b>Magnitude:</b>" + magnitude);

                var mouseX = event.clientX;
                var mouseY = event.clientY;
                box.css({
                    'position': 'absolute',
                    'top': mouseY + 'px',
                    'left': mouseX + 'px',
                    'max-width': '300px',
                    'background-color': 'white',
                    'color': 'black',
                    'padding': '10px',
                    'border': '1px solid black',
                    'background-color': 'rgba(255, 255, 255, 0.9)',
                    'color': 'black',
                    'padding': '5px 10px',
                    'border': '1px solid #ccc',
                    'z-index': '9999',
                    'font-family': 'sometype mono',
                    'font-size': '12px',
                    'border-radius': '5px',
                    'box-shadow': '0 0 5px rgba(0, 0, 0, 0.3)'
                });

                $('body').append(box);
            }, function () {
                $('.earthquakeBox').remove();
            });

            let dotTsu = $('<div></div>');
            dotTsu.attr('tsunamiEvent', tsunamiEvent.TS_INTENSITY);
            dotTsu.addClass('dotTsu');
            dotTsu.css({
                'height': 10,
                'width': 10,
                'left': x,
                'top': stageHeight / 2 - yOffset,
                'background-color': 'blue'
            });
            $('#renderer').append(dotTsu);

            dotTsu.hover(function (event) {
                var day = tsunamiEvent.DAY;
                var month = tsunamiEvent.MONTH;
                var year = tsunamiEvent.YEAR;
                var cause = tsunamiEvent.CAUSE;
                var comments = tsunamiEvent.COMMENTS;
                var time = tsunamiEvent.HOUR + ":" + tsunamiEvent.MINUTE;
                var formattedDate = formatDate(day, month, year);

                var box = $('<div class="tsunamiBox"></div>');
                box.html("<b>Date:</b> " + formattedDate + "<br><b>Time: </b>" + time + "<br><b>Cause:</b>" + cause + "<br><b>Comments:</b> " + comments);

                var boxWidth = 300;
                var boxHeight = box.outerHeight();
                var mouseX = event.clientX;
                var mouseY = event.clientY;

                var offsetX = 15;
                var offsetY = 15;

                if (mouseX + offsetX + boxWidth > $(window).width()) {
                    mouseX = $(window).width() - boxWidth - offsetX;
                }

                if (mouseY + offsetY + boxHeight > $(window).height()) {
                    mouseY = $(window).height() - boxHeight - offsetY;
                }

                box.css({
                    'position': 'absolute',
                    'top': mouseY + offsetY + 'px',
                    'left': mouseX + offsetX + 'px',
                    'max-width': '35%',
                    'background-color': 'rgba(255, 255, 255, 0.9)',
                    'color': 'black',
                    'padding': '5px 10px',
                    'border': '1px solid #ccc',
                    'z-index': '9999',
                    'font-family': 'sometype mono',
                    'font-size': '12px',
                    'border-radius': '5px',
                    'box-shadow': '0 0 5px rgba(0, 0, 0, 0.3)'
                });

                $('body').append(box);
            }, function () {
                $('.tsunamiBox').remove();
            });

            x += step;
        });
    }
});

// HTML part

