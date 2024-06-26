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
        $('.connectionLine').remove(); // Remove any existing lines
        $('.clickableArea').remove(); // Remove any existing clickable areas
        $('#matchesCount').remove(); // Remove any existing match count

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

        // Create and display the match count
        let matchesCount = $('<div></div>');
        matchesCount.attr('id', 'matchesCount');
        matchesCount.css({
            'position': 'absolute',
            'top': stageHeight / 5 + 140, // Position it below the dots
            'left': '50%',
            'transform': 'translateX(-50%)',
            'font-size': '18px',
            'color': 'white',
            'text-align': 'center',
            'font-family': 'Sometype Mono' // Set font family
        });
        matchesCount.text(`Matches found in this year: ${matchingEvents.length}`);
        $('#renderer').append(matchesCount);

        // Calculate total width needed for all points
        const totalWidth = matchingEvents.length * 100; // Increased step size to 100

        // Calculate the starting x position to center the points on the screen
        const startX = stageWidth / 2 - totalWidth / 2;

        let x = startX;
        const yOffset = 60; // Increased the offset to accommodate bigger dots

        let activeIndex = 0; // Set the initial active index

        matchingEvents.forEach((eventPair, index) => {
            const { earthquakeEvent, tsunamiEvent } = eventPair;

            let dotEq = $('<div></div>');
            let dotTsu = $('<div></div>');
            let pairId = `pair-${index}`;

            let magnitude = parseFloat(earthquakeEvent.Magnitude);
            let eqColor, eqSize;
            if (magnitude <= 6) {
                eqColor = 'yellow';
                eqSize = 16; // Increased size
            } else if (magnitude > 6 && magnitude <= 6.5) {
                eqColor = 'orange';
                eqSize = 24; // Increased size
            } else {
                eqColor = 'red';
                eqSize = 40; // Increased size
            }

            dotEq.attr('earthquakeEvent', earthquakeEvent.Magnitude);
            dotEq.attr('year', earthquakeEvent.YEAR);
            dotEq.attr('pair-id', pairId);
            dotEq.addClass('dot');
            dotEq.css({
                'background-color': eqColor,
                'height': eqSize,
                'width': eqSize,
                'left': x + (40 - eqSize) / 2, // Adjust x to center smaller dots
                'top': stageHeight / 5 + yOffset,
                'opacity': index === activeIndex ? 1 : 0.5 // Set initial active dot
            });
            $('#renderer').append(dotEq);

            dotTsu.attr('tsunamiEvent', tsunamiEvent.TS_INTENSITY);
            dotTsu.attr('pair-id', pairId);
            dotTsu.addClass('dotTsu');
            dotTsu.css({
                'height': 40, // Increased size
                'width': 40, // Increased size
                'left': x,
                'top': stageHeight / 5 - yOffset,
                'opacity': index === activeIndex ? 1 : 0.5 // Set initial active dot
            });
            $('#renderer').append(dotTsu);

            let clickableArea = $('<div></div>');
            clickableArea.addClass('clickableArea');
            clickableArea.css({
                'position': 'absolute',
                'left': x,
                'top': stageHeight / 5 - yOffset,
                'width': 40, // Increased size
                'height': 2 * yOffset + 40, // Cover the area between the two dots
                'cursor': 'pointer',
                'opacity': 0 // Invisible
            });
            $('#renderer').append(clickableArea);

            dotEq.add(dotTsu).add(clickableArea).on('mouseenter mouseleave', function (event) {
                const isMouseEnter = event.type === 'mouseenter';

                if (isMouseEnter) {
                    activeIndex = index; // Update active index on mouse enter
                }

                $('.connectionLine').remove(); // Remove any existing lines

                matchingEvents.forEach((otherEventPair, otherIndex) => {
                    const { earthquakeEvent: otherEq, tsunamiEvent: otherTsu } = otherEventPair;
                    const otherPairId = `pair-${otherIndex}`;

                    if (otherIndex === activeIndex) {
                        const opacity = isMouseEnter ? 1 : 0.5;
                        $(`[pair-id="${otherPairId}"]`).css('opacity', 1).toggleClass('active', true);

                        // Add the connection line for the active pair
                        let line = $('<svg class="connectionLine"></svg>');
                        line.attr('width', '100%');
                        line.attr('height', '100%');
                        line.css({
                            'position': 'absolute',
                            'top': 0,
                            'left': 0,
                            'pointer-events': 'none' // Make sure the line doesn't interfere with hover events
                        });

                        let svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

                        // Calculate coordinates for the curve
                        const x1 = parseFloat($(`[pair-id="${otherPairId}"].dot`).css('left')) + eqSize / 2;
                        const y1 = stageHeight / 5 + yOffset + eqSize / 2;
                        const x2 = parseFloat($(`[pair-id="${otherPairId}"].dotTsu`).css('left')) + 20;
                        const y2 = stageHeight / 5 - yOffset + 20;

                        const curvePath = `M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`;
                        svgPath.setAttribute('d', curvePath);
                        svgPath.setAttribute('stroke', '#FFFFFF');
                        svgPath.setAttribute('stroke-width', '4'); // Increased width
                        svgPath.setAttribute('fill', 'none');

                        line.append(svgPath);
                        $('#renderer').append(line);

                        // Update the comments box with the tsunami comments
                        $('#commentsBox').html(`<b>Tsunami Comments:</b> ${otherTsu.COMMENTS}`);
                    } else {
                        const opacity = 0.5;
                        $(`[pair-id="${otherPairId}"]`).css('opacity', opacity).removeClass('active');
                    }
                });
            });

            x += 100;  // Increased step size to 100 for more space between pairs
        });

        // Trigger a hover event on the initial active pair to show the connection line and comments
        $(`[pair-id="pair-${activeIndex}"]`).trigger('mouseenter');
    }
});
