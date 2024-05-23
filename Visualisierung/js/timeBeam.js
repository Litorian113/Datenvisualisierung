/*TODO : 
- SettingsBox vervollständigen.
- Renderer und Bild zentrieren.
- Funktion zur allgemeinen Dot Klasse
- Neue View um Tsunami und Earthquake Events mit einander linear zu vergleichen.
- Slider Responsiv mit einbinden
- Erdbebentiefe Screen mit Intensität mappen
- Erdplatten einblend Funktion
- Colorcode , Farben angleichen beziehungsweise schöneres Farbset wählen.
- Wenn die Map initialisert wird, sollen die Dots der Reihe nach einfaden.
- Slide - Shift Option hinzufügen (Wie ist das umsetzbar?)
- Platten Highlighten wenn maus sich innerhalb befindet (eigener Screen) 

1. Ui und Geschichten               Overview 
2. Slider Jahre                     Zeitlicher Ablauf Time beam
3. Plattenhighlighten               Platten
4. Synchrone Daten vergleichen      Zusammenhang Comparison
5. Tiefe und Stärke                 Stärke und Tiefe Deepth Intensity
*/




// Eine TsuDot Klasse und eine EarthDot Klasse, beinhaltet das Zeichenverhalten und Filter etc? 

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
    tsunamiData.sort((a, b) => a.YEAR - b.YEAR);

    // Filtere die Einträge basierend auf dem Wert des Schlüssels "YEAR"
    tsunamiData = tsunamiData.filter(item => item.YEAR >= 1965 && item.YEAR <= 2016);



    // drawEarthquakeMap();
    // drawTsunamiMap();

});

function drawTsunamiMap() {
    // Hinzufügen der Info-Box für Tsunamis zum HTML-Dokument
    $('body').append('<div id="tsunamiInfoBox"></div>');

    const intensityMax = gmynd.dataMax(tsunamiData, "TS_INTENSITY");

    tsunamiData.forEach(tsunamiEvent => {
        // Überprüfe, ob der Wert von "YEAR" größer oder gleich 1965 ist
        if (tsunamiEvent.YEAR >= 1965) {
            // Entfernen des negativen Vorzeichens, wenn der Wert negativ ist
            const intensity = tsunamiEvent.TS_INTENSITY < 0 ? tsunamiEvent.TS_INTENSITY * -1 : tsunamiEvent.TS_INTENSITY;

            // Bestimmung des Intensitätsbereichs
            let intensityColor = '';
            if (intensity <= 2) {
                intensityColor = '#99f'; // Blauton für niedrige Intensität
            } else if (intensity > 2 && intensity <= 4) {
                intensityColor = '#66f'; // Blauton für mittlere Intensität
            } else {
                intensityColor = '#00f'; // Blauton für hohe Intensität
            }

            const area = gmynd.map(intensity, 0, intensityMax, 200, 200);
            const r = gmynd.circleRadius(area);

            const x = gmynd.map(tsunamiEvent.LONGITUDE, -180, 180, 0, stageWidth);
            const y = gmynd.map(tsunamiEvent.LATITUDE, 90, -90, 0, stageHeight);

            let dot = $('<div></div>');
            dot.attr('lat', tsunamiEvent.LATITUDE)
            dot.attr('long', tsunamiEvent.LONGITUDE)
            dot.attr('tsunamiEvent', tsunamiEvent.YEAR);
            dot.attr('tsunamiEvent', intensity);
            dot.addClass('dotTsu');
            dot.css({
                'height': r,
                'width': r,
                'left': x,
                'top': y,
                'background-color': intensityColor // Zuweisen des Blautons basierend auf der Intensität
            });
            renderer.append(dot);

            // Mouseover-Effekt für Tsunami-Punkte
            dot.mouseover(function (event) {
                const date = tsunamiEvent.DAY + '.' + tsunamiEvent.MONTH + '.' + tsunamiEvent.YEAR;
                const cause = tsunamiEvent.CAUSE;
                const comments = tsunamiEvent.COMMENTS;
                const mouseX = event.pageX;
                const mouseY = event.pageY;
                const box = $('#tsunamiInfoBox');
                const screenWidth = $(window).width();
                const screenHeight = $(window).height();

                // Setzen des Textinhalts der Info-Box
                $('#tsunamiInfoBox').html('<b>Date:</b> ' + date + '<br><b>Cause:</b> ' + cause + '<br><b>Intensity:</b> ' + intensity + '<br><b>Comments:</b> ' + comments);

                // Anpassen der Position der Info-Box
                let leftPosition = mouseX + 20; // Startposition links vom Cursor
                let topPosition = mouseY + 20; // Startposition oberhalb des Cursors

                // Überprüfen, ob genügend Platz rechts vom Cursor vorhanden ist
                if (leftPosition + box.outerWidth() > screenWidth) {
                    leftPosition = screenWidth - box.outerWidth() - 20; // Position links vom Cursors
                }

                // Überprüfen, ob genügend Platz unterhalb des Cursors vorhanden ist
                if (topPosition + box.outerHeight() > screenHeight) {
                    topPosition = screenHeight - box.outerHeight() - 20; // Position oberhalb des Cursors
                }

                // Anpassen der Position der Info-Box
                $('#tsunamiInfoBox').css({
                    'left': leftPosition,
                    'top': topPosition,
                    'display': 'block' // Anzeigen der Box
                });
            });

            // Mouseout-Effekt für Tsunami-Punkte
            dot.mouseout(function () {
                // Ausblenden der Info-Box beim Verlassen des Tsunami-Punkts
                $('#tsunamiInfoBox').css('display', 'none');
            });
        }
    });
}


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

    // console.log("Filtered Tsunami Data:", filteredTsunamiData);
    // console.log("Filtered Earthquake Data:", filteredEarthquakeData);

    // Funktion zum Anzeigen der Erdbeben- und Tsunami-Events basierend auf dem ausgewählten Jahr
    function displayEvents(selectedYear) {
        // console.log("Selected Year:", selectedYear);
        // Vorhandene Punkte entfernen
        $('.dot, .dotTsu').remove();

        

        // Erdbeben-Events für das ausgewählte Jahr anzeigen
        filteredEarthquakeData.forEach(earthquakeEvent => {
            if (earthquakeEvent.YEAR == selectedYear) {
                
                // Anzeige des Erdbeben-Events
                const area = gmynd.map(earthquakeEvent.Magnitude, 0, 10, 80, 80);
                const r = gmynd.circleRadius(area);

                const x = gmynd.map(earthquakeEvent.Longitude, -180, 180, 0, stageWidth);
                const y = gmynd.map(earthquakeEvent.Latitude, 90, -90, 0, stageHeight);

                let dot = $('<div></div>');
                dot.attr('earthquakeEvent', earthquakeEvent.Magnitude);
                let magnitudeLevel = earthquakeEvent.Magnitude;
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
                // console.log("Drawing Earthquake Point:", earthquakeEvent);
            }
        });

        // Tsunami-Events für das ausgewählte Jahr anzeigen
        filteredTsunamiData.forEach(tsunamiEvent => {
            if (tsunamiEvent.YEAR == selectedYear) {
                console.log("Drawing Tsunami Point:", tsunamiEvent);
                // Anzeige des Tsunami-Events
                const intensityMax = gmynd.dataMax(filteredTsunamiData, "TS_INTENSITY");

                const area = gmynd.map(tsunamiEvent.TS_INTENSITY, 0, intensityMax, 200, 200);
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
                console.log(dot)
                $('#renderer').append(dot);

                // console.log("Drawing Tsunami Point:", tsunamiEvent);
            }
        });
    }

});

function drawEarthquakeMap() {
    const magnitudeMax = gmynd.dataMax(earthquakeData, "Magnitude");
    // console.log("magnitude max: " + magnitudeMax);


    earthquakeData.forEach(earthquakeEvent => {
        let area, r;

        // Bestimmen der Fläche und des Radius basierend auf dem Magnitude-Level
        const magnitudeLevel = earthquakeEvent.Magnitude;
        const isLowMagnitude = magnitudeLevel <= 6; // Variable für Magnitude-Level <= 6
        const isMediumMagnitude = magnitudeLevel > 6 && magnitudeLevel <= 6.5;
        const isHighMagnitude = magnitudeLevel > 6.5;
        if (isLowMagnitude) {
            area = gmynd.map(magnitudeLevel, 0, 6, 15, 15); // Bereich bis 6: 10 bis 15
        } else if (isMediumMagnitude) {
            area = gmynd.map(magnitudeLevel, 6, 6.5, 30, 30); // Bereich 6 bis 6.5: 15 bis 30
        } else if (isHighMagnitude) {
            area = gmynd.map(magnitudeLevel, 6.5, magnitudeMax, 80, 80); // Bereich über 6.5: 30 bis 45
        }
        r = gmynd.circleRadius(area);

        const x = gmynd.map(earthquakeEvent.Longitude, -180, 180, 0, stageWidth);
        const y = gmynd.map(earthquakeEvent.Latitude, 90, -90, 0, stageHeight);




        let dot = $('<div></div>');

        if (isLowMagnitude) {
            dot.addClass('lowMagnitude');
            dot.attr('isLowMagnitude', 'true');
        } else {
            dot.attr('isLowMagnitude', 'false');
        }
        if (isMediumMagnitude) {
            dot.addClass('isMediumMagnitude');
            dot.attr('isMediumMagnitude', 'true');
        } else {
            dot.attr('isMediumMagnitude', 'false');
        }
        if (isHighMagnitude) {
            dot.addClass('isHighMagnitude');
            dot.attr('isHighMagnitude', 'true');
        } else {
            dot.attr('isHighMagnitude', 'false');
        }

        dot.attr('earthquakeEvent', magnitudeLevel);

        // Event-Handler für mouseover, mouseout und click
        dot.mouseover(function (event) {
            $(this).addClass('hover')
            $('#hoverLabel').text(magnitudeLevel)
        })
        dot.mouseout(function (event) {
            $(this).removeClass('hover')
            $('#hoverLabel').text(magnitudeLevel)
        })

        dot.click(function (showLabel) {
            $('.clickk').removeClass('clickk')
            $(this).addClass('clickk')
            $('#clickLabel').text(`${earthquakeEvent.Latitude}: ${earthquakeEvent.Longitude}`)
        })

        // Farbzuweisung basierend auf dem Magnitude-Level
        if (isLowMagnitude) {
            dot.css('background-color', '#FFBB00')
        } else if (magnitudeLevel > 6 && magnitudeLevel <= 6.5) {
            dot.css('background-color', '#FB6542')
        } else {
            dot.css('background-color', '#FF0000')
        }

        // Festlegen der Größe und Position des Punktes
        dot.addClass('dot').css({
            'height': r,
            'width': r,
            'left': x,
            'top': y
        });

        renderer.append(dot);
        // // console.log(renderer);
        // renderer.clear();
    });

    // Erzeugen und Positionieren der Info-Box
    $('body').append('<div id="earthquakeInfoBox"></div>');

    $('.dot').mouseover(function (event) {
        const magnitude = $(this).attr('earthquakeEvent');
        const mouseX = event.pageX;
        const mouseY = event.pageY;
        const boxWidth = $('#earthquakeInfoBox').outerWidth();
        const boxHeight = $('#earthquakeInfoBox').outerHeight();

        let posX = mouseX + 20; // 20px rechts von der Maus
        let posY = mouseY - boxHeight / 2; // Zentriert vertikal zur Maus

        // Prüfen, ob die Box außerhalb des rechten Bildschirmrandes liegt
        if (posX + boxWidth > $(window).width()) {
            posX = mouseX - boxWidth - 20; // 20px links von der Maus
        }

        // Prüfen, ob die Box außerhalb des oberen Bildschirmrandes liegt
        if (posY < 0) {
            posY = 0; // Oben ausgerichtet
        }

        $('#earthquakeInfoBox').text('Magnitude: ' + magnitude).css({
            'top': posY,
            'left': posX
        }).show();
    }).mouseout(function () {
        $('#earthquakeInfoBox').hide();
    });
}