// Global variables
let currentPaperSize = '58mm';
let selectedElement = null;
let templateElements = [];
let idCounter = 1;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Paper size selection
    document.getElementById('size-58mm').addEventListener('click', function() {
        switchTemplate('58mm');
    });

    
    
    document.getElementById('size-80mm').addEventListener('click', function() {
        switchTemplate('80mm');
    });
    
    // Add element buttons
    document.querySelectorAll('.add-element').forEach(button => {
        button.addEventListener('click', function() {
            addElement(this.getAttribute('data-type'));
        });
    });
    
    // Download template button
    document.getElementById('download-template').addEventListener('click', downloadTemplate);
    
    // Load initial template (58mm)
    loadTemplate58mm();

    setupUploadTemplate();
    
    // Click outside to deselect
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.draggable-item') && !e.target.closest('#properties-panel')) {
            deselectAll();
        }
    });
     calculateCharacterWidth();
});

function calculateCharacterWidth() {
    // For 58mm printers, typically 32 characters per line (depends on the printer model)
    const charWidth58mm = 32;
    // For 80mm printers, typically 48 characters per line
    const charWidth80mm = 48;
    
    // Store these values for reference when creating templates
    window.charWidth58mm = charWidth58mm;
    window.charWidth80mm = charWidth80mm;
}

// Upload template function
function setupUploadTemplate() {
    const uploadInput = document.getElementById('upload-template');
    
    uploadInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const templateData = JSON.parse(e.target.result);
                
                // Validate template format
                if (!templateData.paperSize || !templateData.elements || !Array.isArray(templateData.elements)) {
                    alert('Invalid template format!');
                    return;
                }
                
                // Switch to correct paper size
                switchTemplate(templateData.paperSize);
                
                // Reset counter
                idCounter = 1;
                
                // Load template elements
                templateElements = [];
                templateData.elements.forEach(element => {
                    const id = 'element-' + (idCounter++);
                    templateElements.push({
                        id: id,
                        type: element.type,
                        properties: { ...element.properties }
                    });
                });
                
                // Render template
                renderTemplate();
                
                // Reset file input
                uploadInput.value = '';
                
            } catch(error) {
                console.error('Error loading template:', error);
                alert('Error loading template: ' + error.message);
            }
        };
        reader.readAsText(file);
    });
}


// Switch template between 58mm and 80mm
function switchTemplate(size) {
    currentPaperSize = size;
    
    const preview = document.getElementById('receipt-preview');
    preview.classList.remove('preview-58mm', 'preview-80mm');
    preview.classList.add(`preview-${size}`);
    
    // Update size buttons
    document.getElementById('size-58mm').classList.remove('bg-blue-500', 'text-white', 'bg-gray-300', 'text-gray-800');
    document.getElementById('size-80mm').classList.remove('bg-blue-500', 'text-white', 'bg-gray-300', 'text-gray-800');
    
    if (size === '58mm') {
        document.getElementById('size-58mm').classList.add('bg-blue-500', 'text-white');
        document.getElementById('size-80mm').classList.add('bg-gray-300', 'text-gray-800');
        
        // Load 58mm template
        loadTemplate58mm();
    } else {
        document.getElementById('size-58mm').classList.add('bg-gray-300', 'text-gray-800');
        document.getElementById('size-80mm').classList.add('bg-blue-500', 'text-white');
        
        // Load 80mm template
        loadTemplate80mm();
    }
}

// Load 58mm template
function loadTemplate58mm() {
    // Reset elements array
    templateElements = [];
    const charWidth = 32;
    
    // Default template elements for 58mm
    const elements58mm = [
        {
            type: 'header',
            properties: {
                content: '  {toko.nama_bisnis}  ',
                bold: true
            }
        },
        {
            type: 'text',
            properties: {
                content: ' {toko.alamat}  ',
                bold: false
            }
        },
        {
            type: 'text',
            properties: {
                content: '  {toko.no_telp}   ',
                bold: false
            }
        },
        {
            type: 'divider',
            properties: {
                style: 'dashed'
            }
        },
        {
            type: 'variable',
            properties: {
                content: 'No: {nota.kode}',
                showLabel: true
            }
        },
        {
            type: 'variable',
            properties: {
                content: 'Kasir: {nota.kasir}',
                showLabel: true
            }
        },
        {
            type: 'variable',
            properties: {
                content: 'Pelanggan: {nota.customer}',
                showLabel: true
            }
        },
        {
            type: 'divider',
            properties: {
                style: 'dashed'
            }
        },
        {
            type: 'product-row',
            properties: {
                content: '{product.name}\n{product.qty} {product.unit} x {product.price}          {product.total}\nDiskon: {product.discount}',
                showDiscount: true
            }
        },
        {
            type: 'divider',
            properties: {
                style: 'dashed'
            }
        },
        {
            type: 'total-row',
            properties: {
                content: 'Total:                      {nota.jumlah_harga}',
                bold: false
            }
        },
        {
            type: 'total-row',
            properties: {
                content: 'Diskon:                     {nota.jumlah_diskon}',
                bold: false
            }
        },
        {
            type: 'total-row',
            properties: {
                content: 'Grand Total:                {nota.sub_total}',
                bold: true
            }
        },
        {
            type: 'total-row',
            properties: {
                content: 'Bayar:                      {nota.jumlah_bayar}',
                bold: false
            }
        },
        {
            type: 'total-row',
            properties: {
                content: 'Kembali:                    {nota.jumlah_kembali}',
                bold: false
            }
        },
        {
            type: 'divider',
            properties: {
                style: 'dashed'
            }
        },
        {
            type: 'text',
            properties: {
                content: '     Terima kasih telah berbelanja     ',
                bold: false
            }
        },
        {
            type: 'variable',
            properties: {
                content: '          {nota.tanggal}          ',
                showLabel: false
            }
        }
    ];
    
    // Add all elements to the template
     elements58mm.forEach(element => {
        const id = 'element-' + (idCounter++);
        element.id = id;
        templateElements.push(element);
    });
    
    // Render template
    renderTemplate();
}

// Load 80mm template
function loadTemplate80mm() {
    // Reset elements array
    templateElements = [];
    
    // Default template elements for 80mm
    const elements80mm = [
        {
            type: 'header',
            properties: {
                content: '                     {toko.nama_bisnis}                     ',
                bold: true
            }
        },
        {
            type: 'text',
            properties: {
                content: '                     {toko.alamat}                     ',
                bold: false
            }
        },
        {
            type: 'text',
            properties: {
                content: '                  {toko.no_telp}                  ',
                bold: false
            }
        },
        {
            type: 'divider',
            properties: {
                style: 'dashed'
            }
        },
        {
            type: 'variable',
            properties: {
                content: 'No. Nota:                                      {nota.kode}',
                showLabel: true
            }
        },
        {
            type: 'variable',
            properties: {
                content: 'Kasir:                                         {nota.kasir}',
                showLabel: true
            }
        },
        {
            type: 'variable',
            properties: {
                content: 'Pelanggan:                                     {nota.customer}',
                showLabel: true
            }
        },
        {
            type: 'variable',
            properties: {
                content: 'Tanggal:                                       {nota.tanggal}',
                showLabel: true
            }
        },
        {
            type: 'divider',
            properties: {
                style: 'dashed'
            }
        },
        {
            type: 'text',
            properties: {
                content: 'DETAIL ITEM:',
                bold: true
            }
        },
        {
            type: 'product-row',
            properties: {
                content: '{product.name}                                {product.total}\n{product.qty} {product.unit} x {product.price}\nDiskon: {product.discount}',
                showDiscount: true
            }
        },
        {
            type: 'divider',
            properties: {
                style: 'dashed'
            }
        },
        {
            type: 'total-row',
            properties: {
                content: 'Total:                                         {nota.jumlah_harga}',
                bold: false
            }
        },
        {
            type: 'total-row',
            properties: {
                content: 'Diskon:                                        {nota.jumlah_diskon}',
                bold: false
            }
        },
        {
            type: 'total-row',
            properties: {
                content: 'Grand Total:                                   {nota.sub_total}',
                bold: true
            }
        },
        {
            type: 'total-row',
            properties: {
                content: 'Bayar:                                         {nota.jumlah_bayar}',
                bold: false
            }
        },
        {
            type: 'total-row',
            properties: {
                content: 'Kembali:                                       {nota.jumlah_kembali}',
                bold: false
            }
        },
        {
            type: 'divider',
            properties: {
                style: 'dashed'
            }
        },
        {
            type: 'text',
            properties: {
                content: '               Terima kasih telah berbelanja               ',
                bold: false
            }
        },
        {
            type: 'text',
            properties: {
                content: '         Barang yang sudah dibeli tidak dapat dikembalikan         ',
                bold: false
            }
        }
    ];
    
    // Add all elements to the template
    elements80mm.forEach(element => {
        const id = 'element-' + (idCounter++);
        element.id = id;
        templateElements.push(element);
    });
    
    // Render template
    renderTemplate();
}

// Render the template 
function renderTemplate() {
    const container = document.getElementById('template-container');
    container.innerHTML = '';
    
    templateElements.forEach(element => {
        let elementHtml = '';
        
        switch(element.type) {
            case 'text':
            case 'header':
                // Change 'html =' to 'elementHtml ='
                elementHtml = `<div id="${element.id}" class="draggable-item ${element.properties.bold ? 'font-bold' : ''}" data-type="${element.type}">
                    <div class="editable-content">${element.properties.content}</div>
                </div>`;
                break;
                
            case 'divider':
                elementHtml = `<div id="${element.id}" class="draggable-item" data-type="divider">
                    <hr class="border-${element.properties.style} border-gray-400">
                </div>`;
                break;
                
            case 'variable':
            case 'product-row':
            case 'total-row':
                const rowBoldClass = element.properties.bold ? 'font-bold' : '';
                elementHtml = `<div id="${element.id}" class="draggable-item ${rowBoldClass}" data-type="${element.type}">
                    <div class="editable-content">${element.properties.content}</div>
                </div>`;
                break;
        }
        
        container.insertAdjacentHTML('beforeend', elementHtml);
        
        // Add event listeners
        const newElement = document.getElementById(element.id);
        newElement.addEventListener('click', function(e) {
            e.stopPropagation();
            selectElement(element.id);
        });
        
        // Make draggable
        makeDraggable(newElement);
    });
}

// Make element draggable
function makeDraggable(element) {
    element.draggable = true;
    
    element.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', element.id);
        setTimeout(() => {
            element.classList.add('opacity-50');
        }, 0);
    });
    
    element.addEventListener('dragend', function() {
        element.classList.remove('opacity-50');
    });
    
    const container = document.getElementById('template-container');
    
    container.addEventListener('dragover', function(e) {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        const draggable = document.querySelector('.draggable-item.opacity-50');
        if (afterElement == null) {
            container.appendChild(draggable);
        } else {
            container.insertBefore(draggable, afterElement);
        }
        
        // Update template data order
        updateTemplateOrder();
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable-item:not(.opacity-50)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Update template elements order based on DOM
function updateTemplateOrder() {
    const orderedElements = [];
    const domElements = document.querySelectorAll('.draggable-item');
    
    domElements.forEach(element => {
        const id = element.id;
        const found = templateElements.find(item => item.id === id);
        if (found) {
            orderedElements.push(found);
        }
    });
    
    templateElements = orderedElements;
}

// Select element and show properties
function selectElement(id) {
    // Deselect all elements
    deselectAll();
    
    // Select new element
    selectedElement = id;
    document.getElementById(id).classList.add('selected');
    
    // Show properties panel
    showProperties(id);
}

// Deselect all elements
function deselectAll() {
    document.querySelectorAll('.draggable-item').forEach(el => {
        el.classList.remove('selected');
    });
    selectedElement = null;
    document.getElementById('properties-panel').classList.add('hidden');
}

// Show properties panel for element
function showProperties(id) {
    const element = templateElements.find(item => item.id === id);
    if (!element) return;
    
    const panel = document.getElementById('properties-panel');
    const content = document.getElementById('properties-content');
    
    panel.classList.remove('hidden');
    content.innerHTML = '';
    
    // Create properties form based on element type
    let html = '';
    
    switch(element.type) {
        case 'text':
        case 'header':
            html = `
                <div class="mb-2">
                    <label class="block text-xs mb-1">Content</label>
                    <textarea class="property-input w-full border rounded px-2 py-1 text-sm font-mono" 
                           data-property="content" rows="3">${element.properties.content}</textarea>
                </div>
                <div class="mb-2">
                    <label class="flex items-center text-xs">
                        <input type="checkbox" class="property-input mr-1" data-property="bold" 
                               ${element.properties.bold ? 'checked' : ''}>
                        Bold
                    </label>
                </div>
            `;
            break;
            
        case 'divider':
            html = `
                <div class="mb-2">
                    <label class="block text-xs mb-1">Style</label>
                    <select class="property-input w-full border rounded px-2 py-1 text-sm" data-property="style">
                        <option value="solid" ${element.properties.style === 'solid' ? 'selected' : ''}>Solid</option>
                        <option value="dashed" ${element.properties.style === 'dashed' ? 'selected' : ''}>Dashed</option>
                        <option value="dotted" ${element.properties.style === 'dotted' ? 'selected' : ''}>Dotted</option>
                    </select>
                </div>
            `;
            break;
            
        case 'variable':
            html = `
                <div class="mb-2">
                    <label class="block text-xs mb-1">Content (with variable)</label>
                    <textarea class="property-input w-full border rounded px-2 py-1 text-sm font-mono" 
                           data-property="content" rows="3">${element.properties.content}</textarea>
                </div>
                <div class="mb-2">
                    <label class="block text-xs mb-1">Available Variables:</label>
                    <ul class="text-xs ml-2">
                        <li>{nota.kode} - Nomor Nota</li>
                        <li>{nota.kasir} - Kasir</li>
                        <li>{nota.customer} - Customer</li>
                        <li>{nota.tanggal} - Tanggal</li>
                        <li>{toko.nama_bisnis} - Nama Toko</li>
                        <li>{toko.alamat} - Alamat Toko</li>
                        <li>{toko.company_phone} - Telepon Toko</li>
                    </ul>
                </div>
            `;
            break;
            
        case 'product-row':
            html = `
                <div class="mb-2">
                    <label class="block text-xs mb-1">Content (with variables)</label>
                    <textarea class="property-input w-full border rounded px-2 py-1 text-sm font-mono" 
                           data-property="content" rows="5">${element.properties.content}</textarea>
                </div>
                <div class="mb-2">
                    <label class="block text-xs mb-1">Available Variables:</label>
                    <ul class="text-xs ml-2">
                        <li>{product.name} - Nama Produk</li>
                        <li>{product.qty} - Jumlah</li>
                        <li>{product.unit} - Satuan</li>
                        <li>{product.price} - Harga</li>
                        <li>{product.total} - Total</li>
                        <li>{product.discount} - Diskon</li>
                    </ul>
                </div>
                <div class="mb-2">
                    <label class="flex items-center text-xs">
                        <input type="checkbox" class="property-input mr-1" data-property="showDiscount" 
                               ${element.properties.showDiscount ? 'checked' : ''}>
                        Show Discount Line
                    </label>
                </div>
            `;
            break;
            
        case 'total-row':
            html = `
                <div class="mb-2">
                    <label class="block text-xs mb-1">Content (with variable)</label>
                    <textarea class="property-input w-full border rounded px-2 py-1 text-sm font-mono" 
                           data-property="content" rows="3">${element.properties.content}</textarea>
                </div>
                <div class="mb-2">
                    <label class="block text-xs mb-1">Available Variables:</label>
                    <ul class="text-xs ml-2">
                        <li>{nota.jumlah_harga} - Total</li>
                        <li>{nota.jumlah_diskon} - Diskon</li>
                        <li>{nota.sub_total} - Sub Total</li>
                        <li>{nota.jumlah_bayar} - Bayar</li>
                        <li>{nota.jumlah_kembali} - Kembali</li>
                    </ul>
                </div>
                <div class="mb-2">
                    <label class="flex items-center text-xs">
                        <input type="checkbox" class="property-input mr-1" data-property="bold" 
                               ${element.properties.bold ? 'checked' : ''}>
                        Bold
                    </label>
                </div>
            `;
            break;
    }
    
    // Delete button for any element
    html += `
        <div class="mt-4">
            <button id="delete-element" class="w-full bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600">
                Delete Element
            </button>
        </div>
    `;
    
    content.innerHTML = html;
    
    // Add event listeners for property changes
    content.querySelectorAll('.property-input').forEach(input => {
        input.addEventListener('change', function() {
            updateElementProperty(id, this.getAttribute('data-property'), this.type === 'checkbox' ? this.checked : this.value);
        });
        
        input.addEventListener('input', function() {
            if (this.tagName === 'TEXTAREA') {
                updateElementProperty(id, this.getAttribute('data-property'), this.value);
            }
        });
    });
    
    // Delete button event
    content.querySelector('#delete-element').addEventListener('click', function() {
        deleteElement(id);
    });
}

// Add element to template
function addElement(type) {
    const id = 'element-' + (idCounter++);
    
    let elementData = {
        id: id,
        type: type,
        properties: {}
    };
    
    switch(type) {
        case 'text':
            elementData.properties = {
                content: 'Sample Text',
                bold: false
            };
            break;
             
        case 'header':
            elementData.properties = {
                content: '{toko.nama_bisnis}',
                bold: true
            };
            break;
            
        case 'divider':
            elementData.properties = {
                style: 'dashed'
            };
            break;
            
        case 'variable':
            elementData.properties = {
                content: 'Label: {data.variable}',
                showLabel: true
            };
            break;
            
        case 'product-row':
            elementData.properties = {
                content: '{product.name}\n{product.qty} {product.unit} x {product.price}          {product.total}',
                showDiscount: false
            };
            break;
            
        case 'total-row':
            elementData.properties = {
                content: 'Total:                      {total}',
                bold: false
            };
            break;
    }
    
    // Add to template data
    templateElements.push(elementData);
    
    // Render template
    renderTemplate();
    
    // Select the new element
    selectElement(id);
}

// Update element property
function updateElementProperty(id, property, value) {
    const element = templateElements.find(item => item.id === id);
    if (!element) return;
    
    element.properties[property] = value;
    
    // Update display
    const domElement = document.getElementById(id);
    
    switch(element.type) {
        case 'text':
        case 'header':
        case 'variable':
        case 'product-row':
        case 'total-row':
            const contentEl = domElement.querySelector('.editable-content');
            if (contentEl) {
                contentEl.textContent = element.properties.content;
            }
            
            // Handle bold property
           // Handle bold property
            if (property === 'bold') {
                if (element.properties.bold) {
                    domElement.classList.add('font-bold');
                } else {
                    domElement.classList.remove('font-bold');
                }
            }
            break;
            
        case 'divider':
            if (property === 'style') {
                const hr = domElement.querySelector('hr');
                hr.className = ''; // Reset classes
                hr.classList.add(`border-${value}`, 'border-gray-400');
            }
            break;
    }
    
    // Special case for product-row showDiscount
    if (element.type === 'product-row' && property === 'showDiscount') {
        let content = element.properties.content;
        
        if (element.properties.showDiscount) {
            // Add discount line if not present
            if (!content.includes('Diskon: {product.discount}')) {
                content += '\nDiskon: {product.discount}';
                element.properties.content = content;
                domElement.querySelector('.editable-content').textContent = content;
            }
        } else {
            // Remove discount line if present
            content = content.replace(/\nDiskon: \{product.discount\}/g, '');
            element.properties.content = content;
            domElement.querySelector('.editable-content').textContent = content;
        }
    }
}

// Delete element
function deleteElement(id) {
    const domElement = document.getElementById(id);
    if (domElement) {
        domElement.remove();
    }
    
    templateElements = templateElements.filter(item => item.id !== id);
    
    // Hide properties panel
    document.getElementById('properties-panel').classList.add('hidden');
    selectedElement = null;
}

// Download template as JSON
function downloadTemplate() {
    // Clean up template data for export
    const exportData = {
        paperSize: currentPaperSize,
        elements: templateElements.map(element => {
            return {
                type: element.type,
                properties: { ...element.properties }
            };
        })
    };
    
    // Create download link
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "thermal-print-template.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
