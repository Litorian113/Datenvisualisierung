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
    const minRadius = 50; // Define the minimum radius of the donut hole

    // Sort data by Depth in descending order
    data.sort((a, b) => b.Depth - a.Depth);

    // Define color ranges
    const highDepthColor = '#CB345E'; // for depths greater than 100
    const mediumDepthColor = '#5ECB34'; // for depths from 34 to 100
    const lowDepthColor = '#345ECB'; // for depths from 0 to 33 #1995AD, #A1D6E2, #F1F1F2

    // Compute the step size based on the number of data points
    const step = (maxRadius - minRadius) / data.length;

    data.forEach((item, index) => {
        // Compute the radius for this point based on its sorted index
        const radius = minRadius + step * (index + 1);

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
            'border': '0.2px solid black',
            // 'opacity': '70%',
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
            const posX = 20; // Fixed position on the left side
            const posY = event.pageY - 20; // Position based on the mouse Y coordinate

            $('#earthquakeInfoBox').html(`Depth: ${depth} km<br>Magnitude: ${magnitude}`).css({
                'left': `${posX}px`,
                'top': `${posY}px`,
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
        size = magnitude / 2;
    } else if (magnitude >= 6.5 && magnitude < 7.2) {
        size = magnitude;
    } else {
        size = magnitude * 2;
    }

    dot.css({
        'width': `${size}px`,
        'height': `${size}px`
    });
}

function getDotColor(depth, magnitude) {
    if (depth > 100) {
        return '#CB345E';
    } else if (depth >= 34 && depth <= 100) {
        return '#5ECB34';
    } else {
        return '#345ECB';
    }
}


function getDotColor(depth, magnitude) {
    if (depth <= 4) {
        return magnitude < 6.5 ? '#2c9448' : (magnitude < 7.2 ? '#80bf91' : '#b3d9bd');
    } else if (depth <= 8) {
        return magnitude < 6.5 ? '#306f67' : (magnitude < 7.2 ? '#83a9a4' : '#b5cbc8');
    } else if (depth <= 12) {
        return magnitude < 6.5 ? '#345a76' : (magnitude < 7.2 ? '#859cad' : '#b6c4ce');
    } else if (depth <= 16) {
        return magnitude < 6.5 ? '#3b457d' : (magnitude < 7.2 ? '#898fb1' : '#b8bcd0');
    } else if (depth <= 20) {
        return magnitude < 6.5 ? '#644265' : (magnitude < 7.2 ? '#a28ea3' : '#c7bbc8');
    } else if (depth <= 24) {
        return magnitude < 6.5 ? '#8c3c4a' : (magnitude < 7.2 ? '#ba8a92' : '#d6b9be');
    } else if (depth <= 28) {
        return magnitude < 6.5 ? '#b33332' : (magnitude < 7.2 ? '#d18584' : '#e3b6b5');
    } else if (depth <= 32) {
        return magnitude < 6.5 ? '#ce562c' : (magnitude < 7.2 ? '#e29a80' : '#eec2b3');
    } else if (depth <= 50) {
        return magnitude < 6.5 ? '#fef5a4' : (magnitude < 7.2 ? '#ebb57d' : '#f3d3b1');
    } else {
       return magnitude < 6.5 ? '#fde201' : (magnitude < 7.2 ? '#feee67' : '#fef5a4'); 
    }
}

// Adding CSS for the fixed position div
$('<style>')
    .prop('type', 'text/css')
    .html(`
        #earthquakeInfoBox {
            position: fixed;
            z-index: 1000;
            background-color: rgb(20, 20, 30);
            color: white;
            font-family: 'sometype mono', monospace;
            padding: 5px;
            display: none;
            pointer-events: none;
            margin-left: 200px;
        }
    `)
    .appendTo('head');

// Adding the fixed position div to the body
$('body').append('<div id="earthquakeInfoBox"></div>');
