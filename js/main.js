$(function () {
    var MAX_ROL = 10;
    var anticipo_minimo;
    var multiplicador_base;
    var multiplicador_antiguedad;

    var socios = [
        {"Ingreso": 0, "+ Rol": 1, "Rol": 10},
        {"Ingreso": 0, "+ Rol": 1, "Rol": 5},
        {"Ingreso": 3, "+ Rol": 1, "Rol": 9},
        {"Ingreso": 3, "+ Rol": 1, "Rol": 8},
        {"Ingreso": 1, "+ Rol": 1, "Rol": 2}
    ];

    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            elements: {
                line: {
                    tension: 0, // disables bezier curves
                }
            }
        }
    });

    var colors = [
        "#f44336",
        "#E91E63",
        "#9C27B0",
        "#673AB7",
        "#3F51B5",
        "#2196F3",
        "#03A9F4",
        "#00BCD4",
        "#009688",
        "#4CAF50",
        "#8BC34A",
        "#CDDC39",
        "#FFEB3B",
        "#FFC107",
        "#FF9800",
        "#795548",
        "#9E9E9E",
        "#607D8B"
    ];

    function pickColor(idx) {
        return colors[idx % colors.length];
    }

    c_anticipo_minimo = $('#anticipo_minimo');
    c_multiplicador_base = $('#multiplicador_base');
    c_multiplicador_antiguedad = $('#multiplicador_antiguedad');

    c_anticipo_minimo.change(function () {
        anticipo_minimo = parseFloat(c_anticipo_minimo.val());
        update_data();
    });
    c_multiplicador_base.change(function () {
        multiplicador_base = parseFloat(c_multiplicador_base.val());
        update_data();
    });
    c_multiplicador_antiguedad.change(function () {
        multiplicador_antiguedad = parseFloat(c_multiplicador_antiguedad.val());
        update_data();
    });

    c_anticipo_minimo.change();
    c_multiplicador_base.change();
    c_multiplicador_antiguedad.change();





    function calc_anticipo(anio, ingreso, rol, aumento_rol) {
        if(anio<ingreso){
            return null;
        }
        var anios = (anio - ingreso);
        rol = Math.min(MAX_ROL, rol + aumento_rol * anios);
        var ret = anticipo_minimo * (multiplicador_base + rol / 10) * (1 + anios * multiplicador_antiguedad);
        return Math.round(ret*100)/100;
    }

    function update_data() {
        var datasets = [];
        var labels = [];
        for (var i = 0; i < 10; i++) {
            labels.push("Año "+i);
        }
        var dataset;
        for (var i = 0; i < socios.length; i++) {
            dataset = {
                label: 'Socio #' + (i+1),
                data: [],
                borderColor: pickColor(i),
                fill: false
            };

            for (var j = 0; j < 10; j++) {
                dataset.data.push(calc_anticipo(j, socios[i]["Ingreso"], socios[i]["Rol"], socios[i]["+ Rol"]))
            }
            datasets.push(dataset);
        }
        myChart.data.datasets = datasets;
        myChart.data.labels = labels;
        myChart.update();
    }




    $("#jsGrid").jsGrid({
        width: "100%",
        height: "400px",

        inserting: true,
        editing: true,
        sorting: false,
        paging: false,

        data: socios,

        fields: [
            {name: "Ingreso", type: "number", width: 50},
            {name: "Rol", type: "number", width: 50},
            {name: "+ Rol", type: "number", width: 50},
            {type: "control"}
        ],

        onItemInserted: update_data,
        onItemUpdated: update_data,
        onItemDeleted: update_data,
    });
});