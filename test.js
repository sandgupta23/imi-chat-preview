x = {
    "entities": [{"counter": 3, "entity_id": "12", "required": false, "template_key": "fallback"}, {
        "counter": 3,
        "entity_id": "11",
        "required": false,
        "template_key": "fallback"
    }, {"counter": 3, "entity_id": "2", "required": false, "template_key": ""}, {
        "counter": 3,
        "entity_id": "7",
        "required": false,
        "template_key": ""
    }, {"counter": 3, "entity_id": "4", "required": false, "template_key": ""}],
    "utterances": [{
        "entities": [{"entity_id": "4", "start": 2, "end": 14, "type": "custom", "value": "at can you d"}],
        "utterance": "What can you do? What can you do? What can you do? What can you do? "
    }, {
        "entities": [{"entity_id": "12", "start": 22, "end": 25, "type": "custom", "value": ""}],
        "utterance": "What can you do? "
    }, {"entities": [], "utterance": "How can you help? "}, {"entities": [], "utterance": "Helpp "}, {
        "entities": [],
        "utterance": "What do you do? "
    }],
    "intent_id": "help",
    "name": "Help",
    "reset_state": true,
    "template_key": "help"
}