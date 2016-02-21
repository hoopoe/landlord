var _identifyTool = 'infoTool';

function identifyComboboxSelectionChanged(){
    var checkboxId;
    var toolId;

    switch(dojo.byId('identifyCombobox').value){
        case '0':
            _identifyTool = 'infoTool';
            checkboxId = 'cadastreCheckbox';
            toolId = 'cadastreTool';
            break;
        case '1':
            _identifyTool = 'infoToolZouit';
            checkboxId = 'zouitCheckbox';
            toolId = 'zouitTool';
            break;
        case '2':
            _identifyTool = 'infoToolTerrZone';
            checkboxId = 'terrZoneCheckbox';
            toolId = 'terrZoneTool';
            break;
        case '3':
            _identifyTool = 'infoToolBorder';
            checkboxId = 'atdCheckbox';
            toolId = 'atdTool';
            break;
        /*case '4':
            _identifyTool = 'infoToolATD';
            checkboxId = 'atdCheckbox';
            toolId = 'atdTool';
            break;*/
        case '5':
            _identifyTool = 'infoToolFrame';
            checkboxId = 'frameCheckbox';
            toolId = 'fullFrameTool';
            break;
    }

    if (!dojo.byId(checkboxId).checked){
        dojo.byId(checkboxId).checked = true;
        toolButtonClick(toolId);
    }

    _selectedTool = _identifyTool;
}

function identifyToolClick(){
    dojo.byId('identifyCombobox').disabled = false;

    toolButtonClick(_identifyTool);
}

function resetIdentifyCombobox(disabled){
    var cb = dojo.byId('identifyCombobox');

    if (disabled){
        cb.disabled = true;//'disabled';
    }

    cb.value = 0;
    identifyComboboxSelectionChanged()
}