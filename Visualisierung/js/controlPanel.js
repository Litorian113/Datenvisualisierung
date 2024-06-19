
// $(document).ready(function() {
//     // Alle Tsunami-Events initial ausblenden
//     $('.dotTsu').css('transition', 'opacity 0.3s').css('opacity', '0');
    
//     // Toggle-Switch-Element auswählen
//     const toggleSwitch = $('#toggleSwitch input[type="checkbox"]');
    
//     // Funktion zum Ein- und Ausblenden der Tsunami-Events
//     function toggleTsunamiEvents(isChecked) {
//         const dots = $('.dotTsu');
        
//         // Ein- oder Ausblenden der Tsunami-Events
//         dots.css('opacity', isChecked ? '1' : '0');
//     }
    
//     // Event-Handler für den Toggle-Switch hinzufügen
//     toggleSwitch.change(function() {
//         // Überprüfen, ob der Toggle-Switch eingeschaltet ist
//         const isChecked = $(this).is(':checked');
        
//         // Tsunami-Events ein- oder ausblenden
//         toggleTsunamiEvents(isChecked);
//     });
    
//     // Beim Laden der Seite den Status des Toggle-Switches überprüfen und Tsunami-Events entsprechend ein- oder ausblenden
//     toggleTsunamiEvents(toggleSwitch.is(':checked'));
// });




// $(document).ready(function() {
//     // Funktion zum Ein- und Ausblenden der Erdbeben-Events
//     function toggleEarthquakeEvents(isChecked) {
//         $('.dot').css('opacity', isChecked ? '1' : '0');
//     }
    
//     // Event-Handler für den Erdbeben-Switch
//     $('#toggleSwitchEarth input[type="checkbox"]').change(function() {
//         const isChecked = $(this).is(':checked');
//         toggleEarthquakeEvents(isChecked);
//     });
    
//     // Beim Laden der Seite den Status des Erdbeben-Switches überprüfen und entsprechend Erdbeben-Events ein- oder ausblenden
//     toggleEarthquakeEvents($('#toggleSwitchEarth input[type="checkbox"]').is(':checked'));
// });

// let toggleLow = true;
// let toggleHigh = true;
// let toggleMedium = true;

// $(document).ready(function() {
// // let dotsHidden = false; // Variable, um den aktuellen Zustand der ausgeblendeten Punkte zu verfolgen
// // var loader = document.getElementById('loaderContainer');
//     $("#intesity-low .btn").click(function(){

//         // loader.style.display = 'flex';
//         toggleLow = !toggleLow;
//         earthquakeData = getEarthquakeData(); //Initialisiere EarthquakeData damit lädt er nochmal alle neu in die EarthquakeData
//         clearRenderer(); //Dann clearen wir alle Punkte auf dem Canvas
//         if (!toggleLow) {
//             earthquakeData = filterMagnitudeIntervall(6, 99); // Dann Filtern wir sexy nach Magnitude
//         } else {
//             // earthquakeData = filterMagnitudeIntervall(0,6);
//         }
//         if (!toggleMedium) {
//             earthquakeData = filterMagnitudeIntervallOutside(6, 6.5); // Dann Filtern wir sexy nach Magnitude
//         } else {
//             // earthquakeData = filterMagnitudeIntervallOutside(6, 6.5);
//         }
//         if (!toggleHigh) {
//             earthquakeData = filterMagnitudeIntervallOutside(6.5,10); // Dann Filtern wir sexy nach Magnitude
//         }  else {
//             // earthquakeData = filterMagnitudeIntervallOutside(6.5, 10);
//         }
//         drawTsunamiMap();
//         drawEarthquakeMap(); //Wir malen alle Punkte die in dem gefilterten EarthquakData drin sind 
//         // loader.style.display = 'none';
//     });
// });


// $(document).ready(function() {
//     // var loader = document.getElementById('loaderContainer');
//     // Event-Handler für den Button, um Tsunami-Dots mit geringer Intensität auszublenden oder wieder einzublenden
//     $('#intesity-medium .btn').click(function() {
//         toggleMedium = !toggleMedium;
//         earthquakeData = getEarthquakeData(); //Initialisiere EarthquakeData damit lädt er nochmal alle neu in die EarthquakeData
//         clearRenderer(); //Dann clearen wir alle Punkte auf dem Canvas
//         if (!toggleLow) {
//             earthquakeData = filterMagnitudeIntervall(6, 99); // Dann Filtern wir sexy nach Magnitude
//         } else {
//             // earthquakeData = filterMagnitudeIntervall(0,6);
//         }
//         if (!toggleMedium) {
//             earthquakeData = filterMagnitudeIntervallOutside(6, 6.5); // Dann Filtern wir sexy nach Magnitude
//         } else {
//             // earthquakeData = filterMagnitudeIntervallOutside(6, 6.5);
//         }
//         if (!toggleHigh) {
//             earthquakeData = filterMagnitudeIntervallOutside(6.5,10); // Dann Filtern wir sexy nach Magnitude
//         }  else {
//             // earthquakeData = filterMagnitudeIntervallOutside(6.5, 10);
//         }
//         drawTsunamiMap();
//         drawEarthquakeMap(); //Wir malen alle Punkte die in dem gefilterten EarthquakData drin sind 
//         // loader.style.display = 'none';
//     });
// });


// $(document).ready(function() {
//     // Event-Handler für den Button, um Tsunami-Dots mit geringer Intensität auszublenden oder wieder einzublenden
//     // var loader = document.getElementById('loaderContainer');
//     $('#intesity-high .btn').click(function() {
//         toggleHigh = !toggleHigh;
//         earthquakeData = getEarthquakeData(); //Initialisiere EarthquakeData damit lädt er nochmal alle neu in die EarthquakeData
//         clearRenderer(); //Dann clearen wir alle Punkte auf dem Canvas
//         if (!toggleLow) {
//             earthquakeData = filterMagnitudeIntervall(6, 99); // Dann Filtern wir sexy nach Magnitude
//         } else {
//             // earthquakeData = filterMagnitudeIntervall(0,6);
//         }
//         if (!toggleMedium) {
//             earthquakeData = filterMagnitudeIntervallOutside(6, 6.5); // Dann Filtern wir sexy nach Magnitude
//         } else {
//             // earthquakeData = filterMagnitudeIntervallOutside(6, 6.5);
//         }
//         if (!toggleHigh) {
//             earthquakeData = filterMagnitudeIntervallOutside(6.5,10); // Dann Filtern wir sexy nach Magnitude
//         }  else {
//             // earthquakeData = filterMagnitudeIntervallOutside(6.5, 10);
//         }
//         drawTsunamiMap();
//         drawEarthquakeMap(); //Wir malen alle Punkte die in dem gefilterten EarthquakData drin sind 
//         // loader.style.display = 'none';
//     });
// });