function pollForNewPatient(url) {
    const A = AUI();
    A.io.request(url, {
        cache:false,
        sync:false,
        timeout:60 * 1000,
        method:'post',
        on:{
            success:function () {
                var response = this.get('responseData');
                if (response == 'update=true') {
                    var dialog = new A.Dialog({
                        bodyContent:'Aktuell patient har uppdaterats. Vill du ladda om sidan och visa den nya patienten? Observera att nästa gång du laddar om sidan kommer den nya patienten visas.',
                        buttons:[
                            {
                                text: 'Ja, ladda om sidan',
                                handler:function () {
                                    window.location.reload();
                                }
                            },
                            {
                                text: 'Nej, jag vill behålla den patient som syns på skärmen',
                                handler: function() {
                                    pollForNewPatient(url);
                                    this.close();
                                }
                            }
                        ],
                        centered:true,
                        draggable:true,
                        modal:true,
                        title:'Patientkontext uppdaterad'
                    }).render();
                } else if (response == 'update=false') {
                    pollForNewPatient(url);
                } else {
                    // Something probably went wrong, e.g. session was invalidated so the client is not logged in. Quit sending requests.
                }
            },
            failure:function () {
                // We stop polling
            }
        }
    });
}