angular.module('adminctrl', [])
    // Admin
    .controller('dashboardController', dashboardController)
    .controller('penyakitController', penyakitController)
    .controller('gejalaController', gejalaController)
    .controller('ruleController', ruleController)
    .controller('diagnosaController', diagnosaController)
    .controller('riwayatController', riwayatController)
    .controller('pasienController', pasienController)
    ;

function dashboardController($scope, dashboardServices) {
    $scope.$emit("SendUp", "Dashboard");
    $scope.datas = {};
    $scope.title = "Dashboard";
    var all = [];
    mapboxgl.accessToken = 'pk.eyJ1Ijoia3Jpc3R0MjYiLCJhIjoiY2txcWt6dHgyMTcxMzMwc3RydGFzYnM1cyJ9.FJYE8uVi-eVl_mH_DLLEmw';

    dashboardServices.get().then(res => {
        $scope.datas = res;
        $scope.$applyAsync(x => {
            var map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/satellite-v9',
                center: [140.7052499, -2.5565586],
                zoom: 12
            });
            $scope.datas.forEach(param => {
                var item = new mapboxgl.Marker({ color: param.status == 'Diajukan' ? 'red' : param.status == 'Proses' ? 'Yellow' : '' })
                    .setLngLat([Number(param.long), Number(param.lat)])
                    .setPopup(
                        new mapboxgl.Popup({ offset: 25 }) // add popups
                            .setHTML(
                                `<h4><strong>Nomor Laporan: ${param.nomor}</strong></h4><p>Permasalahan: ${param.kerusakan}<br>Status: <strong>${param.status}</strong></p>`
                            )
                    )
                    .addTo(map);
                all.push(item);
            });
        })
    })
}

function penyakitController($scope, penyakitServices, pesan) {
    $scope.$emit("SendUp", "Penyakit");
    $scope.datas = {};
    $.LoadingOverlay('show');
    penyakitServices.get().then(res => {
        $scope.datas = res;
        $.LoadingOverlay('hide');
    })

    $scope.edit = (param) => {
        $scope.model = angular.copy(param);
    }

    $scope.reset = () => {
        $scope.model = {};
    }

    $scope.save = () => {
        pesan.dialog('Yakin ingin melanjutkan proses?', "Ya", "Tidak", "info").then(x => {
            $.LoadingOverlay('show');
            if ($scope.model.id) {
                penyakitServices.put($scope.model).then(res => {
                    $scope.model = {}
                    $.LoadingOverlay('hide');
                })
            } else {
                penyakitServices.post($scope.model).then(res => {
                    $scope.model = {}
                    $.LoadingOverlay('hide');
                })
            }
        })
    }

    $scope.delete = (param) => {
        pesan.dialog('Yakin ingin melanjutkan proses?', "Ya", "Tidak").then(x => {
            $.LoadingOverlay('show');
            penyakitServices.deleted(param).then(res => {
                $.LoadingOverlay('hide');
            })
        })
    }
}

function gejalaController($scope, gejalaServices, pesan) {
    $scope.$emit("SendUp", "Gejala");
    $scope.datas = {};
    $.LoadingOverlay('show');
    gejalaServices.get().then(res => {
        $scope.datas = res;
        $.LoadingOverlay('hide');
    })

    $scope.edit = (param) => {
        $scope.model = angular.copy(param);
    }

    $scope.reset = () => {
        $scope.model = {};
    }

    $scope.save = () => {
        pesan.dialog('Yakin ingin melanjutkan proses?', "Ya", "Tidak", "info").then(x => {
            $.LoadingOverlay('show');
            if ($scope.model.id) {
                gejalaServices.put($scope.model).then(res => {
                    $scope.model = {}
                    $.LoadingOverlay('hide');
                })
            } else {
                gejalaServices.post($scope.model).then(res => {
                    $scope.model = {}
                    $.LoadingOverlay('hide');
                })
            }
        })
    }

    $scope.delete = (param) => {
        pesan.dialog('Yakin ingin melanjutkan proses?', "Ya", "Tidak").then(x => {
            $.LoadingOverlay('show');
            gejalaServices.deleted(param).then(res => {
                $.LoadingOverlay('hide');
            })
        })
    }
}

function ruleController($scope, ruleServices, penyakitServices, gejalaServices, helperServices, pesan) {
    $scope.$emit("SendUp", "Rule");
    $scope.datas = {};
    $.LoadingOverlay('show');

    gejalaServices.get().then(res => {
        $scope.gejalas = res;
    })

    penyakitServices.byId(helperServices.lastPath).then(res => {
        $scope.penyakit = res;
    })
    ruleServices.get(helperServices.lastPath).then(res => {
        $scope.datas = res;
        $.LoadingOverlay('hide');
    })

    $scope.edit = (param) => {
        $scope.model = angular.copy(param);
        $scope.gejala = $scope.gejalas.find(x => x.id == $scope.model.gejala_id);
        console.log($scope.gejala);
    }

    $scope.reset = () => {
        $scope.model = {};
        $scope.gejala = undefined;
    }

    $scope.save = () => {
        pesan.dialog('Yakin ingin melanjutkan proses?', "Ya", "Tidak", "info").then(x => {
            $.LoadingOverlay('show');
            if ($scope.model.id) {
                ruleServices.put($scope.model).then(res => {
                    $scope.model = {}
                    $scope.gejala = undefined;
                    $.LoadingOverlay('hide');
                    pesan.Success('Berhasil');
                })
            } else {
                ruleServices.post($scope.model).then(res => {
                    $scope.model = {}
                    $scope.gejala = undefined;
                    $.LoadingOverlay('hide');
                    pesan.Success('Berhasil');
                })
            }
        })
    }

    $scope.delete = (param) => {
        pesan.dialog('Yakin ingin melanjutkan proses?', "Ya", "Tidak").then(x => {
            $.LoadingOverlay('show');
            ruleServices.deleted(param).then(res => {
                $.LoadingOverlay('hide');
            })
        })
    }
}

function diagnosaController($scope, diagnosaServices, pesan) {
    $scope.$emit("SendUp", "Pembayaran");
    $scope.datas = {};
    $.LoadingOverlay('show');
    diagnosaServices.get().then(res => {
        $scope.datas = res;
        $.LoadingOverlay('hide');
    })

    $scope.reset = () => {
        $scope.result = undefined;
        $scope.pilihan = [];
        $.LoadingOverlay('show');
        diagnosaServices.get().then(res => {
            $scope.datas = res;
            $.LoadingOverlay('hide');
        })
    }

    $scope.diagnosa = () => {
        console.log();
        diagnosaServices.diagnosa($scope.datas.filter(x => x.jawaban)).then(res => {
            $scope.result = res;
            $scope.hasil = $scope.result.reduce((previous, current) => {
                return current.combine > previous.combine ? current : previous;
            });
            $scope.pilihan = $scope.datas.filter(x => x.jawaban);
            console.log($scope.pilihan);
            console.log($scope.hasil);
        })
    }

    $scope.save = () => {
        pesan.dialog('Yakin ingin menyimpan?', "Ya", "Tidak", "info").then(x => {
            $.LoadingOverlay('show');
            $scope.hasil.daftarGejala = $scope.pilihan;
            diagnosaServices.post($scope.hasil).then(res => {
                $.LoadingOverlay('hide');
                $scope.reset();
            })
        })
    }

    $scope.delete = (param) => {
        pesan.dialog('Yakin ingin melanjutkan proses?', "Ya", "Tidak").then(x => {
            $.LoadingOverlay('show');
            diagnosaServices.deleted(param).then(res => {
                $.LoadingOverlay('hide');
            })
        })
    }
}

function riwayatController($scope, riwayatServices, pesan) {
    $scope.$emit("SendUp", "Pembayaran");
    $scope.datas = {};
    $.LoadingOverlay('show');
    riwayatServices.get().then(res => {
        $scope.datas = res;
        $scope.datas.forEach(element => {
            element.tanggal = new Date(element.tanggal);
        });
        $.LoadingOverlay('hide');
    })

    $scope.delete = (param) => {
        pesan.dialog('Yakin ingin melanjutkan proses?', "Ya", "Tidak").then(x => {
            $.LoadingOverlay('show');
            riwayatServices.deleted(param).then(res => {
                $.LoadingOverlay('hide');
            })
        })
    }
}

function pasienController($scope, pasienServices, pesan) {
    $scope.$emit("SendUp", "Pembayaran");
    $scope.datas = {};
    $.LoadingOverlay('show');
    pasienServices.get().then(res => {
        $scope.datas = res;
        $.LoadingOverlay('hide');
    })
    
    $scope.tampilRiwayat = (param) => {
        $.LoadingOverlay('show');
        pasienServices.byId(param.id).then(res => {
            $scope.dataRiwayat = res;
            $scope.dataRiwayat.forEach(element => {
                element.tanggal = new Date(element.tanggal);
            });
            console.log($scope.dataRiwayat);
            $(".showView").modal('show');
            $.LoadingOverlay('hide');
        })
    }
}

