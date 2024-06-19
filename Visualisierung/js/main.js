let stageHeight;
let stageWidth;
let renderer;
let sliderDiv;


$(function () {
    renderer = $('#renderer');
    stageHeight = renderer.innerHeight();
    stageWidth = renderer.innerWidth();
    sliderDiv = $('#slider-div');

    let image = $("#slider-image");
    // get width and height of the image

    let imageWidth = image.width();
    let imageHeight = image.height();
    // calculate width and height for the slider and the image
    let sliderWidth = stageWidth;
    let sliderHeight = (2 * sliderWidth * imageHeight) / imageWidth;
    // fit slider to window width
    renderer.css({
        width: sliderWidth + "px",
        height: sliderHeight + "px",
    });
    image.css({
        width: sliderWidth * 2 + "px",
        height: sliderHeight + "px",
    });


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
    });
    // Sortiere den Datensatz nach dem Wert des Schlüssels "YEAR" aufsteigend
    tsunamiData.sort((a, b) => a.YEAR - b.YEAR);

    // Filtere die Einträge basierend auf dem Wert des Schlüssels "YEAR"
    tsunamiData = tsunamiData.filter(item => item.YEAR >= 1965 && item.YEAR <= 2016);

    function addMagnitudeLevel(data) {
        data.forEach(function (item) {
            let magnitudeLevel;
            const magnitude = parseFloat(item["Magnitude"]);

            if (magnitude <= 6) {
                magnitudeLevel = "low";
            } else if (magnitude <= 6.5) {
                magnitudeLevel = "medium";
            } else {
                magnitudeLevel = "high";
            }

            item["magnitudeLevel"] = magnitudeLevel;
        });
    }

    // Aufruf der Funktion, um den Datensatz earthquakeData zu aktualisieren
    addMagnitudeLevel(earthquakeData);

    // prepareData();


    drawEarthquakeMap();
    drawTsunamiMap();

    let copy = sliderDiv.clone();
    copy.css({
        left: sliderWidth + "px",
    });
    renderer.append(copy);

    let dragging = false;
    let clickX, actX;

    renderer.on("mousedown", function (event) {
        // Prevent default behavior. In this case, prevent dragging of the image
        event.preventDefault();

        // Get the current position of the slider
        actX = renderer.position().left;
        // Get the mouse position relative to the window
        clickX = event.clientX;

        // Now we are in dragging mode
        dragging = true;
    });

    $(window).on("mousemove", handleMouseMove);

    function handleMouseMove(event) {
        if (!dragging) return;

        // calculate the new position of the slider
        let moveX = event.clientX - clickX;
        let newX = actX + moveX;

        // check if the slider is out of bounds
        if (newX < -stageWidth) {
            newX += stageWidth;
        } else if (newX > 0) {
            newX -= stageWidth;
        }

        // set the slider position
        renderer.css({
            left: newX + "px",
        });
    }

    $(window).on("mouseup", handleMouseUp);

    function handleMouseUp() {
        dragging = false;
    }

    // Mouseover-Effekt für Tsunami-Punkte
$("#renderer").on("mouseover", ".dotTsu", function (event) {
    const date = $(this).attr('date');
    const cause = $(this).attr('cause');
    const intensity = $(this).attr('tsunamiIntensity');
    const comments = $(this).attr('comments');
    const mouseX = event.pageX;
    const mouseY = event.pageY;
    const box = $('#tsunamiInfoBox');
    const screenWidth = $(window).width();
    const screenHeight = $(window).height();

    // Setzen des Textinhalts der Info-Box
    $('#tsunamiInfoBox').html('<b>Date:</b> ' + date + '<br><b>Cause:</b> ' + cause + '<br><b>Intensity:</b> ' + intensity + '<br><b>Comments:</b> ' + comments);

    // Anpassen der Position der Info-Box
    let leftPosition = mouseX + 20; // Startposition rechts vom Cursor
    let topPosition = mouseY + 20; // Startposition unterhalb des Cursors

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
$("#renderer").on("mouseout", ".dotTsu", function () {
    // Ausblenden der Info-Box beim Verlassen des Tsunami-Punkts
    $('#tsunamiInfoBox').css('display', 'none');
        });


        $("#renderer").on("mouseover", ".dot", function (event) {
            const magnitude = $(this).attr('earthquakeEvent');
            const date = $(this).attr('Date');
            const type = $(this).attr('Type');
            const depth = $(this).attr('Depth');
            const mouseX = event.pageX;
            const mouseY = event.pageY;
            const box = $('#earthquakeInfoBox');
            const screenWidth = $(window).width();
            const screenHeight = $(window).height();
        
            // Setzen des Textinhalts der Info-Box
            $('#earthquakeInfoBox').html('<b>Date:</b> ' + date + '<br><b>Type:</b> ' + type + '<br><b>Magnitude:</b> ' + magnitude +  '<br><b>Depth:</b> ' + depth);
    
        // Anpassen der Position der Info-Box
        let leftPosition = mouseX + 20; // Startposition rechts vom Cursor
        let topPosition = mouseY + 20; // Startposition unterhalb des Cursors
    
        // Überprüfen, ob genügend Platz rechts vom Cursor vorhanden ist
        if (leftPosition + box.outerWidth() > screenWidth) {
            leftPosition = screenWidth - box.outerWidth() - 20; // Position links vom Cursors
        }
    
        // Überprüfen, ob genügend Platz unterhalb des Cursors vorhanden ist
        if (topPosition + box.outerHeight() > screenHeight) {
            topPosition = screenHeight - box.outerHeight() - 20; // Position oberhalb des Cursors
        }
    
        // Anpassen der Position der Info-Box
        $('#earthquakeInfoBox').css({
            'left': leftPosition,
            'top': topPosition,
            'display': 'block' // Anzeigen der Box
        });
    }).mouseout(function () {
        // Ausblenden der Info-Box beim Verlassen des Earthquake-Punkts
        $('#earthquakeInfoBox').css('display', 'none');
    });
});


function drawTsunamiMap() {
    // Hinzufügen der Info-Box für Tsunamis zum HTML-Dokument
    $('body').append('<div id="tsunamiInfoBox"></div>');

    const intensityMax = gmynd.dataMax(tsunamiData, "TS_INTENSITY");

    tsunamiData.forEach(tsunamiEvent => {
        // Überprüfe, ob der Wert von "YEAR" größer oder gleich 1965 ist
        if (tsunamiEvent.YEAR >= 1965) {
            // Entfernen des negativen Vorzeichens, wenn der Wert negativ ist
            let intensity;
            if (tsunamiEvent.TS_INTENSITY < 0) {
                intensity = tsunamiEvent.TS_INTENSITY * -1; // Positiver Wert, wenn negativ
            } else if (!tsunamiEvent.TS_INTENSITY) {
                intensity = (0.5 + Math.random() * 2.5).toFixed(2); // Zufällige Intensität zwischen 0 und 3, wenn der Wert leer ist
            } else {
                intensity = tsunamiEvent.TS_INTENSITY; // Originalwert, wenn weder negativ noch leer
            }

            // Bestimmung des Intensitätsbereichs
            let intensityColor = '';
            let intensityClass = '';
            if (intensity <= 2) {
                intensityColor = '#99f'; // Blauton für niedrige Intensität
                intensityClass = 'lowIntensity';
            } else if (intensity > 2 && intensity <= 4) {
                intensityColor = '#66f'; // Blauton für mittlere Intensität
                intensityClass = 'isMediumIntensity';
            } else {
                intensityColor = '#00f'; // Blauton für hohe Intensität
                intensityClass = 'isHighIntensity';
            }

            const area = gmynd.map(intensity, 0, intensityMax, 200, 200);
            const r = gmynd.circleRadius(area);

            const x = gmynd.map(tsunamiEvent.LONGITUDE, -180, 180, 0, stageWidth);
            const y = gmynd.map(tsunamiEvent.LATITUDE, 90, -90, 0, stageHeight);

            let dot = $('<div></div>');
            dot.attr('lat', tsunamiEvent.LATITUDE)
            dot.attr('long', tsunamiEvent.LONGITUDE)
            dot.attr('tsunamiEvent', tsunamiEvent.YEAR);
            dot.attr('tsunamiIntensity', intensity);

            // Informationen in Attribute speichern, um in on 
            dot.attr('date', tsunamiEvent.DAY + '.' + tsunamiEvent.MONTH + '.' + tsunamiEvent.YEAR);
            dot.attr('cause', tsunamiEvent.CAUSE);
            dot.attr('comments', tsunamiEvent.COMMENTS);
            
            // Adding class for intensity level
            dot.addClass('dotTsu');
            dot.addClass(intensityClass);
            dot.css({
                'height': r,
                'width': r,
                'left': x,
                'top': y,
                'background-color': intensityColor // Zuweisen des Blautons basierend auf der Intensität
            });
            sliderDiv.append(dot);
        }
    });
}

function clearRenderer() {
    let worldMap = renderer.children().get(0);
    $('#renderer').children().remove();
    renderer.append(worldMap);
}

function sortMagnitude() {
    earthquakeData.sort((a, b) => {
        if (a.Magnitude > b.Magnitude) {
            return 1;
        } else {
            return -1;
        }
    })
}

function filterMagnitude(magnitude) {
    return earthquakeData.filter((a) => {
        if (a.Magnitude > magnitude) {
            return true;
        } else {
            return false;
        }
    })
}

function filterMagnitudeIntervall(magnitudeLow, magnitudeHigh) {
    return earthquakeData.filter((a) => {
        if (a.Magnitude > magnitudeLow && a.Magnitude <= magnitudeHigh) {
            return true;
        } else {
            return false;
        }
    })
}

function filterMagnitudeIntervallOutside(magnitudeLow, magnitudeHigh) {
    return earthquakeData.filter((a) => {
        if (a.Magnitude <= magnitudeLow || a.Magnitude > magnitudeHigh) {
            return true;
        } else {
            return false;
        }
    })
}

function drawEarthquakeMap() {
    const magnitudeMax = gmynd.dataMax(earthquakeData, "Magnitude");
    console.log("magnitude max: " + magnitudeMax);


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
        dot.attr('Date', earthquakeEvent.Date);
        dot.attr('Type', earthquakeEvent.Type);
        dot.attr('Depth', earthquakeEvent.Depth);




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

        sliderDiv.append(dot);
    });

    // Erzeugen und Positionieren der Info-Box
    $('body').append('<div id="earthquakeInfoBox"></div>');
}
// Event-Listener für den Button btn1
document.getElementById('btn1').addEventListener('click', function() {
    console.log("Is pressed");
    document.querySelectorAll('div.lowMagnitude.dot').forEach(function(element) {
        if (element.style.display === 'none') {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    });
});

document.getElementById('btn2').addEventListener('click', function() {
    console.log("Is pressed");
    document.querySelectorAll('div.isMediumMagnitude.dot').forEach(function(element) {
        if (element.style.display === 'none') {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    });
});

document.getElementById('btn3').addEventListener('click', function() {
    console.log("Is pressed");
    document.querySelectorAll('div.isHighMagnitude.dot').forEach(function(element) {
        if (element.style.display === 'none') {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    });
});


// TSUNAMI BTNS

document.getElementById('tsuBtn1').addEventListener('click', function() {
    console.log("Is pressed");
    document.querySelectorAll('div.dotTsu.lowIntensity').forEach(function(element) {
        if (element.style.display === 'none') {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    });
});

document.getElementById('tsuBtn2').addEventListener('click', function() {
    console.log("Is pressed");
    document.querySelectorAll('div.dotTsu.isMediumIntensity').forEach(function(element) {
        if (element.style.display === 'none') {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    });
});

document.getElementById('tsuBtn3').addEventListener('click', function() {
    console.log("Is pressed");
    document.querySelectorAll('div.dotTsu.isHighIntensity').forEach(function(element) {
        if (element.style.display === 'none') {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    });
});
// // Rufen Sie die Funktion auf, um die Erdbebenkarte zu zeichnen
// drawEarthquakeMap();




$(document).ready(function () {
    $('#togglePanel').click(function () {
        $('.controlPanel').toggleClass('open'); /* Fügt oder entfernt die Klasse 'open' */
        $('#togglePanel').toggleClass('open'); /* Fügt oder entfernt die Klasse 'open' */
    });
});








$(document).ready(function() {
    // Alle Tsunami-Events initial ausblenden
    $('.dotTsu').css('transition', 'opacity 0.3s').css('opacity', '0');
    
    // Toggle-Switch-Element auswählen
    const toggleSwitch = $('#toggleSwitch input[type="checkbox"]');
    
    // Funktion zum Ein- und Ausblenden der Tsunami-Events
    function toggleTsunamiEvents(isChecked) {
        const dots = $('.dotTsu');
        
        // Ein- oder Ausblenden der Tsunami-Events
        dots.css('opacity', isChecked ? '1' : '0');
    }
    
    // Event-Handler für den Toggle-Switch hinzufügen
    toggleSwitch.change(function() {
        // Überprüfen, ob der Toggle-Switch eingeschaltet ist
        const isChecked = $(this).is(':checked');
        
        // Tsunami-Events ein- oder ausblenden
        toggleTsunamiEvents(isChecked);
    });
    
    // Beim Laden der Seite den Status des Toggle-Switches überprüfen und Tsunami-Events entsprechend ein- oder ausblenden
    toggleTsunamiEvents(toggleSwitch.is(':checked'));
});



$(document).ready(function() {
    // Funktion zum Ein- und Ausblenden der Erdbeben-Events
    function toggleEarthquakeEvents(isChecked) {
        $('.dot').css('opacity', isChecked ? '1' : '0');
    }
    
    // Event-Handler für den Erdbeben-Switch
    $('#toggleSwitchEarth input[type="checkbox"]').change(function() {
        const isChecked = $(this).is(':checked');
        toggleEarthquakeEvents(isChecked);
    });
    
    // Beim Laden der Seite den Status des Erdbeben-Switches überprüfen und entsprechend Erdbeben-Events ein- oder ausblenden
    toggleEarthquakeEvents($('#toggleSwitchEarth input[type="checkbox"]').is(':checked'));
});


document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll(".btnTsu");

    buttons.forEach(button => {
        button.addEventListener("click", function() {
            this.classList.toggle("active");
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll(".btn");

    buttons.forEach(button => {
        button.addEventListener("click", function() {
            this.classList.toggle("active");
        });
    });
    
});


