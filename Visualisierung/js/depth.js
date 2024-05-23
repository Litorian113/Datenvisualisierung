let renderer, stageHeight, stageWidth;

$(function () {
    renderer = $('#renderer');
    stageHeight = renderer.height();
    stageWidth = renderer.width();

    const lowThreshold = 6.5;
    const mediumThreshold = 7.3;

    // Sortiere den Datensatz nach Magnitude in aufsteigender Reihenfolge
    depthData.sort((a, b) => a.Magnitude - b.Magnitude);

    // Filtere die Werte entsprechend den Grenzwerten
    const low = depthData.filter(item => item.Magnitude < lowThreshold);
    const medium = depthData.filter(item => item.Magnitude >= lowThreshold && item.Magnitude < mediumThreshold);
    const high = depthData.filter(item => item.Magnitude >= mediumThreshold);

    console.log('Low Magnitude:', low);
    console.log('Medium Magnitude:', medium);
    console.log('High Magnitude:', high);

    drawSunBurst(depthData);
});

function drawSunBurst(data) {
    const centerX = stageWidth / 2;
    const centerY = stageHeight / 2;
    const maxRadius = 400; // Define the maximum radius of the circle

    // Sort data by Depth in descending order
    data.sort((a, b) => b.Depth - a.Depth);

    // Define color ranges
    const highDepthColor = '#CB345E'; // for depths greater than 100
    const mediumDepthColor = '#5ECB34'; // for depths from 34 to 100
    const lowDepthColor = '#345ECB'; // for depths from 0 to 33 #1995AD, #A1D6E2, #F1F1F2

    // Compute the step size based on the number of data points
    const step = maxRadius / data.length;

    data.forEach((item, index) => {
        // Compute the radius for this point based on its sorted index
        const radius = step * (index + 1);

        // Generate a random angle
        const angle = Math.random() * 2 * Math.PI;

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        const dot = $('<div></div>').addClass('dot').css({
            'height': '5px',
            'width': '5px',
            'left': x,
            'top': y,
            'position': 'absolute',
            'border-radius': '50%',
            'border': '1px solid black',
            'background-color': getDotColor(item.Depth, item.Magnitude)
        }).attr({
            'earthquakeEvent': item.Depth,
            'earthquakeMagnitude': item.Magnitude
        });

        renderer.append(dot);

        setDotSizeProportional(dot, item.Magnitude);
    });

    $('.dot').on({
        mouseover: function (event) {
            const depth = $(this).attr('earthquakeEvent');
            const magnitude = $(this).attr('earthquakeMagnitude');
            const mouseX = event.pageX;
            const mouseY = event.pageY;
            const boxWidth = $('#earthquakeInfoBox').outerWidth();
            const boxHeight = $('#earthquakeInfoBox').outerHeight();

            const posX = mouseX + 20;
            const posY = mouseY - boxHeight / 2;

            $('#earthquakeInfoBox').text(`Depth: ${depth} km, Magnitude: ${magnitude}`).css({
                'left': posX,
                'top': posY,
                'display': 'block'
            });
        },
        mouseout: function () {
            $('#earthquakeInfoBox').css('display', 'none');
        }
    });
}

function setDotSizeProportional(dot, magnitude) {
    let size;

    if (magnitude < 6.5) {
        size = 2;
    } else if (magnitude >= 6.5 && magnitude < 7.2) {
        size = 10;
    } else {
        size = 20;
    }

    dot.css({
        'width': `${size}px`,
        'height': `${size}px`
    });
}

function getDotColor(depth, magnitude) {
    if (depth <= 30) {
        return magnitude < 6.5 ? '#3747FF' : (magnitude < 7.2 ? '#5499FF' : '#66DDFF');
    } else if (depth <= 80) {
        return magnitude < 6.5 ? '#8542FF' : (magnitude < 7.2 ? '#BF5AFF' : '#ED75FF');
    } else {
        return magnitude < 6.5 ? '#FF4601' : (magnitude < 7.2 ? '#FA6F00' : '#FF9901');
    }
}
