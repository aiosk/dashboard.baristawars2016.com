const chartSetter = ()=> {
    const JwtAxios = axios.create({
        baseURL: urlBase,
        // timeout: 1000,
        headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
    });

    const elGender = $('.card--gender');
    if (elGender.length > 0) {
        const elChart = $('#genderChart');

        JwtAxios.get('/dashboard/chart/gender')
            .then((res)=> {
                // elChart.html(JSON.stringify(res.data));

                google.charts.load('current', {'packages': ['corechart']});
                google.charts.setOnLoadCallback(drawChart);

                function drawChart () {
                    const data = google.visualization.arrayToDataTable([
                        ['gender', 'value'],
                        ['male', res.data.male],
                        ['female', res.data.female]
                    ]);
                    var options = {
                        // title: 'My Daily Activities'
                        title: '',
                        // legend: 'none',
                        // pieSliceText: 'label',
                        slices: {1: {offset: 0.2},}
                    };

                    var chart = new google.visualization.PieChart(document.getElementById('genderChart'));

                    chart.draw(data, options);
                }
            })
            .catch((err)=> {
                elChart.html(err);
            })
    }


    const elAge = $('.card--age');
    if (elAge.length > 0) {
        const elChart = $('#ageChart');

        JwtAxios.get('/dashboard/chart/age')
            .then((res)=> {
                elChart.html(res.data.average);
            })
            .catch((err)=> {
                elChart.html(err);
            })
    }

    const elPosition = $('.card--position');
    if (elPosition.length > 0) {
        const elChart = $('#positionChart');

        JwtAxios.get('/dashboard/chart/position')
            .then((res)=> {
                // elChart.html(JSON.stringify(res.data));

                google.charts.load('current', {'packages': ['corechart']});
                google.charts.setOnLoadCallback(drawChart);

                function drawChart () {
                    const data = google.visualization.arrayToDataTable([
                        ['position', 'male', 'female'],
                        ['barista', res.data.barista.items.male, res.data.barista.items.female],
                        ['owner', res.data.owner.items.male, res.data.owner.items.female],
                        ['individu', res.data.individu.items.male, res.data.individu.items.female]
                    ]);
                    const view = new google.visualization.DataView(data);
                    view.setColumns([0, 1,
                        { calc: "stringify",
                            sourceColumn: 1,
                            type: "string",
                            role: "annotation" },
                        2]);

                    var options = {
                        // title: '',
                        // legend: 'none',
                        // pieSliceText: 'label',
                        isStacked: true,
                        bars:'horizontal'
                    };

                    var chart = new google.visualization.ColumnChart(document.getElementById('positionChart'));

                    chart.draw(data, options);
                }
            })
            .catch((err)=> {
                elChart.html(err);
            })
    }
    const elMaps = $('.card--maps');
    if (elMaps.length > 0) {
        const elChart = $('#mapsChart');

        JwtAxios.get('/dashboard/chart/maps')
            .then((res)=> {
                elChart.html(JSON.stringify(res.data));
            })
            .catch((err)=> {
                elChart.html(err);
            })
    }

};
