function chartC3Region(valorContasReceber, valorContasPagar, valoresDatas, valoresY, valorMaximoY) {

    var line_regions_chart = c3.generate({
        data: {
            columns: [
              ['Contas a receber', valorContasReceber[0], valorContasReceber[1], valorContasReceber[2], valorContasReceber[3], valorContasReceber[4], valorContasReceber[5], valorContasReceber[6], valorContasReceber[7], valorContasReceber[8], valorContasReceber[9], valorContasReceber[10], valorContasReceber[11]],
              ['Contas a pagar'  ,   valorContasPagar[0],   valorContasPagar[1],   valorContasPagar[2],   valorContasPagar[3],   valorContasPagar[4],   valorContasPagar[5],   valorContasPagar[6],   valorContasPagar[7],   valorContasPagar[8],   valorContasPagar[9],   valorContasPagar[10],   valorContasPagar[11]]
            ],
            regions: {
                'Contas a receber': [{
                    'start': 1,
                    'style': 'dashed'
                }], // currently 'dashed' style only
                'Contas a pagar': [{
                    'start': 1
                }]
            }
        },
        axis: {
            x: {
                outer: false,
                max: 11,
                min: 0,
                tick: {
                    count: 12,
                    values: [14, valoresDatas[1], valoresDatas[2], valoresDatas[3], valoresDatas[4], valoresDatas[5], valoresDatas[6], valoresDatas[7], valoresDatas[8], valoresDatas[9], valoresDatas[10], valoresDatas[11]]
                }
            },
            y: {
                max: valorMaximoY,
                min: 0,
                tick: {
                    outer: true,
                    count: 7,
                    values: [valoresY[0], valoresY[1], valoresY[2], valoresY[3], valoresY[4], valoresY[5], valoresY[6]]
                }
            }
        },
        grid: {
            x: {
                show: true
            },
            y: {
                show: true
            }
        }
    });
}