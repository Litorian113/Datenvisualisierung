let stageHeight;
let stageWidth;
let renderer;

$(function () {
    renderer = $('#renderer');
    stageHeight = $('img.worldMap').innerHeight();
    stageWidth = $('img.worldMap').innerWidth();

    earthquakeData.forEach(function (item) {
        // Datum in Tag, Monat und Jahr aufteilen
        let dateParts = item["Date"].split(".");
        // Hinzufügen von Tag, Monat und Jahr zum Datensatz
        item["DAY"] = dateParts[0];
        item["MONTH"] = dateParts[1];
        let year = parseInt(dateParts[2]); // Konvertiere das Jahr in eine Zahl
        // Füge je nach Bedingung das entsprechende Jahr hinzu
        if (year <= 99 && year >= 65) {
            year += 1900;
        } else if (year >= 0 && year <= 16) {
            year += 2000;
        }
        item["YEAR"] = year.toString(); // Konvertiere das Jahr zurück in einen String und speichere es im Datensatz
        // Löschen des ursprünglichen Datums, falls erforderlich
        // delete item["Date"];
    });
    // Sortiere den Datensatz nach dem Wert des Schlüssels "YEAR" aufsteigend
    // tsunamiData.sort((a, b) => a.YEAR - b.YEAR);

    tsunamiData = tsunamiData.filter(item => item.YEAR >= 1965 && item.YEAR <= 2016);
    tsunamiData.sort((a, b) => a.YEAR - b.YEAR);

    // Filtere die Einträge basierend auf dem Wert des Schlüssels "YEAR"
    // tsunamiData = tsunamiData.filter(item => item.YEAR >= 1965 && item.YEAR <= 2016);

});



$(function () {
    let stageHeight = $('#renderer').innerHeight();
    let stageWidth = $('#renderer').innerWidth();

    // Initialanzeige der Erdbeben-Events für das Jahr 1965

    // Globale Variablen für gefilterte Daten initialisieren
    let filteredEarthquakeData = [];
    let filteredTsunamiData = [];

    // Filterfunktion aufrufen, um Daten beim Laden der Seite zu filtern
    filterData();

    // Range Slider Event-Handler
    $('#yearRange').on('input', function () {
        let selectedYear = $(this).val();
        $('#currentYear').text(selectedYear);
        // Funktion aufrufen, um Erdbeben- und Tsunami-Events für das ausgewählte Jahr anzuzeigen
        displayEvents(selectedYear);
    });

    // Funktion zum Filtern der Daten
    function filterData() {
        // Erdbeben-Daten filtern
        filteredEarthquakeData = earthquakeData.filter(earthquakeEvent => {
            let eventYear = parseInt(earthquakeEvent.YEAR);
            return eventYear >= 1965 && eventYear <= 2016;
        });

        // Tsunami-Daten filtern
        filteredTsunamiData = tsunamiData.filter(tsunamiEvent => {
            let eventYear = parseInt(tsunamiEvent.YEAR);
            return eventYear >= 1965 && eventYear <= 2016;
        });
    }

    displayEvents(1965);

    function adjustDate(dateStr) {
        // Split the input date string into day, month, and year
        let [day, month, year] = dateStr.split('.');
    
        // Convert the year from string to number for comparison
        let yearNumber = parseInt(year, 10);
    
        // Adjust the year based on the given conditions
        if (yearNumber >= 65) {
            year = '19' + year;
        } else if (yearNumber <= 16) {
            year = '20' + year;
        } else {
            throw new Error('Year out of expected range');
        }
    
        // Return the adjusted date string
        return `${day}.${month}.${year}`;
    }

    function formatDate(day, month, year) {
        // Konvertiere Tag und Monat zu Zahlen und füge führende Nullen hinzu
        day = day.toString().padStart(2, '0');
        month = month.toString().padStart(2, '0');
    
        // Setze das Datum im Format DD.MM.YYYY zusammen
        return `${day}.${month}.${year}`;
    }

    // Funktion zum Anzeigen der Erdbeben- und Tsunami-Events basierend auf dem ausgewählten Jahr
    function displayEvents(selectedYear) {
        $('.dot, .dotTsu').remove();
        // Erdbeben-Events für das ausgewählte Jahr anzeigen
        filteredEarthquakeData.forEach(earthquakeEvent => {
            if (earthquakeEvent.YEAR == selectedYear) {
                // Anzeige des Erdbeben-Events
                let area, r;
                const magnitudeLevel = earthquakeEvent.Magnitude;
                if (magnitudeLevel <= 6) {
                    area = gmynd.map(magnitudeLevel, 0, 6, 50, 50);
                } else if (magnitudeLevel > 6 && magnitudeLevel <= 6.5) {
                    area = gmynd.map(magnitudeLevel, 6, 6.5, 250, 250);
                } else {
                    area = gmynd.map(magnitudeLevel, 6.5, 10, 500, 500);
                }
                r = gmynd.circleRadius(area);

                const x = gmynd.map(earthquakeEvent.Longitude, -180, 180, 0, stageWidth);
                const y = gmynd.map(earthquakeEvent.Latitude, 90, -90, 0, stageHeight);

                let dot = $('<div></div>');
                dot.attr('earthquakeEvent', magnitudeLevel);
                dot.attr('year', earthquakeEvent.YEAR)
                if (magnitudeLevel <= 6) {
                    dot.css('background-color', 'yellow')
                } else if (magnitudeLevel > 6 && magnitudeLevel <= 6.5) {
                    dot.css('background-color', 'orange')
                } else {
                    dot.css('background-color', 'red')
                }
                dot.addClass('dot');
                dot.css({
                    'height': r,
                    'width': r,
                    'left': x,
                    'top': y
                });
                $('#renderer').append(dot);

                dot.hover(function (event) {
                    // Daten des Erdbeben-Events extrahieren
                    // var earthquakeEvent = $(this).attr('earthquakeEvent');
                    // var date = filteredEarthquakeData[$(this).index()].Date;

                    // Hover-Box erstellen und mit Daten füllen
                    var box = $('<div class="earthquakeBox"></div>');
                    var magnitude = earthquakeEvent.Magnitude;
                    var date = earthquakeEvent.Date;
                    var time = earthquakeEvent.Time;
                    var correctedDate = adjustDate(date);

                    box.html("<b>Date:</b> " + correctedDate + "<br><b>Time: </b>" + time + "<br><b>Magnitude:</b>" + magnitude);

                    // Position der Box festlegen
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

                    // Box dem HTML-Dokument hinzufügen
                    $('body').append(box);
                }, function () {
                    // Box entfernen, wenn der Mauszeiger den Dot verlässt
                    $('.earthquakeBox').remove();
                });
            }
        });


        // Tsunami-Events für das ausgewählte Jahr anzeigen
        filteredTsunamiData.forEach(tsunamiEvent => {
            if (tsunamiEvent.YEAR == selectedYear) {
                // console.log("Drawing Tsunami Point:", tsunamiEvent);
                // Anzeige des Tsunami-Events
                const intensityMax = gmynd.dataMax(filteredTsunamiData, "TS_INTENSITY");

                const area = gmynd.map(tsunamiEvent.TS_INTENSITY, 0, intensityMax, 1000, 1000);
                const r = gmynd.circleRadius(area);

                const x = gmynd.map(tsunamiEvent.LONGITUDE, -180, 180, 0, stageWidth);
                const y = gmynd.map(tsunamiEvent.LATITUDE, 90, -90, 0, stageHeight);

                let dot = $('<div></div>');
                dot.attr('tsunamiEvent', tsunamiEvent.TS_INTENSITY);
                dot.addClass('dotTsu');
                dot.css({
                    'height': r,
                    'width': r,
                    'left': x,
                    'top': y
                });
                // console.log(dot) 
                $('#renderer').append(dot);

                dot.hover(function (event) {
                    // Daten des Tsunami-Events extrahieren
                    // var tsunamiEvent = $(this).attr('tsunamiEvent');
                    // var date = tsunamiEvent.DAY + "." +
                    //     tsunamiEvent.MONTH + "." +
                    //     tsunamiEvent.YEAR;
                    var day = tsunamiEvent.DAY;
                    var month = tsunamiEvent.MONTH;
                    var year = tsunamiEvent.YEAR;
                    var cause = tsunamiEvent.CAUSE;
                    var comments = tsunamiEvent.COMMENTS;
                    var time = tsunamiEvent.HOUR + ":" + tsunamiEvent.MINUTE;
                    var formattedDate = formatDate(day, month, year);


                    // Hover-Box erstellen und mit Daten füllen
                    var box = $('<div class="tsunamiBox"></div>');
                    box.html("<b>Date:</b> " + formattedDate + "<br><b>Time: </b>" + time +"<br><b>Cause:</b>" + cause +"<br><b>Comments:</b> " + comments);
                     

                    // Position der Box relativ zum Cursor festlegen
                    var boxWidth = 300; // Breite der Box
                    var boxHeight = box.outerHeight(); // Höhe der Box
                    var mouseX = event.clientX;
                    var mouseY = event.clientY;

                    // Positionierung relativ zum Cursor anpassen
                    var offsetX = 15; // Abstand von Cursor zur Box
                    var offsetY = 15; // Abstand von Cursor zur Box

                    // Überprüfen, ob die Box rechts aus dem Bildschirm ragt
                    if (mouseX + offsetX + boxWidth > $(window).width()) {
                        mouseX = $(window).width() - boxWidth - offsetX;
                    }

                    // Überprüfen, ob die Box unten aus dem Bildschirm ragt
                    if (mouseY + offsetY + boxHeight > $(window).height()) {
                        mouseY = $(window).height() - boxHeight - offsetY;
                    }

                    // Position der Box festlegen und Styles anpassen
                    box.css({
                        'position': 'absolute',
                        'top': mouseY + offsetY + 'px',
                        'left': mouseX + offsetX + 'px',
                        'max-width': '35%', // Maximalbreite auf 35% des sichtbaren Bereichs
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

                    // Box dem HTML-Dokument hinzufügen
                    $('body').append(box);
                }, function () {
                    // Box entfernen, wenn der Mauszeiger den Dot verlässt
                    $('.tsunamiBox').remove();
                });



            }
        });
    }

});