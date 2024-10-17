let factures = [];
let facturaActualId = null; // id que s'esta editant
let facturaActual = { linies: [], descompte: 0, gst: 10 };

//POSEM LOS LISTENERS
document.addEventListener('DOMContentLoaded', function() {
    inicialitzarTaules();
    document.getElementById('afegirLinia').addEventListener('click', afegirLinia);
    document.getElementById('guardarFactura').addEventListener('click', guardarFactura);
    document.getElementById('descompte').addEventListener('input', actualitzarTotal);
    document.getElementById('gst').addEventListener('input', actualitzarTotal);
});


function inicialitzarTaules() {
    let taulaFactures = $('#taulaFactures').DataTable(); //innitt
    taulaFactures.clear();

    for (let i = 0; i < factures.length; i++) {
        taulaFactures.row.add([
            factures[i].id,
            factures[i].data,
            factures[i].total.toFixed(2) + ' €', //max2 vals
            `<button onclick="editarFactura(${factures[i].id})">Editar/Consultar</button>
             <button onclick="eliminarFactura(${factures[i].id})">Eliminar</button>`
        ]).draw(false);
    }
}

function afegirLinia() {
    var tbody = document.querySelector('#taulaFactura tbody');
    var tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" class="descripcio"></td>
        <td><input type="number" class="quantitat" value="1" min="1"></td>
        <td><input type="number" class="taxa" value="0" min="0" step="0.01"></td>
        <td class="import">0,00 €</td>
        <td><button onclick="eliminarLinia(this)">Eliminar</button></td>
    `;
    tbody.appendChild(tr);
    afegirEventsLinia(tr);
}

function afegirEventsLinia(tr) {
    tr.querySelector('.quantitat').addEventListener('input', actualitzarLinia);
    tr.querySelector('.taxa').addEventListener('input', actualitzarLinia);
}

function actualitzarLinia(event) {
    var tr = event.target.closest('tr'); // target més proxim tr
    var quantitat = parseFloat(tr.querySelector('.quantitat').value) || 0;
    var taxa = parseFloat(tr.querySelector('.taxa').value) || 0;
    var importTotal = quantitat * taxa;
    tr.querySelector('.import').textContent = importTotal.toFixed(2) + ' €';
    actualitzarTotal();
}

function eliminarLinia(button) {
    button.closest('tr').remove();
    actualitzarTotal();
}

function actualitzarTotal() {
    var subtotal = 0;
    var files = document.querySelectorAll('#taulaFactura tbody tr');
    for (var i = 0; i < files.length; i++) {
        subtotal += parseFloat(files[i].querySelector('.import').textContent) || 0;
    }
    
    var descompte = parseFloat(document.getElementById('descompte').value) || 0;
    var gst = parseFloat(document.getElementById('gst').value) || 0;
    
    var descompteValor = subtotal * (descompte / 100);
    var subtotalAmbDescompte = subtotal - descompteValor;
    var gstValor = subtotalAmbDescompte * (gst / 100);
    var total = subtotalAmbDescompte + gstValor;
    
    document.getElementById('totalFactura').textContent = 'Total: ' + total.toFixed(2) + ' €';
}

function guardarFactura() {
    var novaFactura = {
        id: facturaActualId || factures.length + 1, // USAR ID QUE TOCA SI EDITEM
        data: (new Date()).toLocaleDateString(), //data de forma legible i string.
        linies: [],
        descompte: parseFloat(document.getElementById('descompte').value) || 0,
        gst: parseFloat(document.getElementById('gst').value) || 0,
        total: parseFloat(document.getElementById('totalFactura').textContent.split(' ')[1])
    };

    var files = document.querySelectorAll('#taulaFactura tbody tr'); //pilla tots els elements tr de la taula taulaFactura tbody
    for (var i = 0; i < files.length; i++) {
        novaFactura.linies.push({
            descripcio: files[i].querySelector('.descripcio').value,
            quantitat: parseFloat(files[i].querySelector('.quantitat').value) || 0,
            taxa: parseFloat(files[i].querySelector('.taxa').value) || 0,
            import: parseFloat(files[i].querySelector('.import').textContent) || 0
        });
    }

    if (facturaActualId) {
        // EDITAR FACTURA
        for (var i = 0; i < factures.length; i++) {
            if (factures[i].id === facturaActualId) {
                factures[i] = novaFactura; 
                break;
            }
        }
    } else {
        // NOVAFACTURA..AFEGIR
        factures.push(novaFactura);
    }

    facturaActualId = null; // reset id
    inicialitzarTaules();
    netejarFormulari();
}

function netejarFormulari() {
    document.querySelector('#taulaFactura tbody').innerHTML = '';
    document.getElementById('descompte').value = '0';
    document.getElementById('gst').value = '10';
    actualitzarTotal();
}

function editarFactura(id) {
    let factura = null;
    for (let i = 0; i < factures.length; i++) {
        if (factures[i].id === id) {
            factura = factures[i];
            break;
        }
    }

    if (factura) {
        facturaActualId = factura.id; //ID QUE S'EDITA
        netejarFormulari();
        for (var i = 0; i < factura.linies.length; i++) {
            var tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="text" class="descripcio" value="${factura.linies[i].descripcio}"></td>
                <td><input type="number" class="quantitat" value="${factura.linies[i].quantitat}" min="1"></td>
                <td><input type="number" class="taxa" value="${factura.linies[i].taxa}" min="0" step="0.01"></td>
                <td class="import">${factura.linies[i].import.toFixed(2)} €</td>
                <td><button onclick="eliminarLinia(this)">Eliminar</button></td>
            `;
            document.querySelector('#taulaFactura tbody').appendChild(tr);
            afegirEventsLinia(tr);
        }
        document.getElementById('descompte').value = factura.descompte;
        document.getElementById('gst').value = factura.gst;
        actualitzarTotal();
    }
}

function eliminarFactura(id) {
    factures = factures.filter(factura => factura.id !== id); //PROPOSTA GPT
    //LA MEUA PROPOSTA NO BORRAVA BE.
    // var novesFactures = [];
    // for (var i = 0; i < factures.length; i++) {
    //     if (factures[i].id !== id) {
    //         novesFactures.push(factures[i]);
    //     }
    // }
    inicialitzarTaules();
    if (factures.length === 0) {
        $('#taulaFactures').DataTable().clear().draw();
    }
}
