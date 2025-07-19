module.exports = {
    defaultKitchenObject: {
        "schedule": {
            "sunday": {
                "morningTimeSlotStart": "00:00",
                "afterNoonTimeSlotStart": "00:00",
                "eveningTimeSlotStart": "00:00",
                "nightTimeSlotStart": "00:00",
                "morningTimeSlotEnd": "00:00",
                "afterNoonTimeSlotEnd": "00:00",
                "eveningTimeSlotEnd": "00:00",
                "nightTimeSlotEnd": "00:00",
                "morningTimeSlot": false,
                "afterNoonTimeSlot": false,
                "eveningTimeSlot": false,
                "nightTimeSlot": false
            },
            "monday": {
                "morningTimeSlotStart": "00:00",
                "afterNoonTimeSlotStart": "00:00",
                "eveningTimeSlotStart": "00:00",
                "nightTimeSlotStart": "00:00",
                "morningTimeSlotEnd": "00:00",
                "afterNoonTimeSlotEnd": "00:00",
                "eveningTimeSlotEnd": "00:00",
                "nightTimeSlotEnd": "00:00",
                "morningTimeSlot": false,
                "afterNoonTimeSlot": false,
                "eveningTimeSlot": false,
                "nightTimeSlot": false
            },
            "tuesday": {
                "morningTimeSlotStart": "00:00",
                "afterNoonTimeSlotStart": "00:00",
                "eveningTimeSlotStart": "00:00",
                "nightTimeSlotStart": "00:00",
                "morningTimeSlotEnd": "00:00",
                "afterNoonTimeSlotEnd": "00:00",
                "eveningTimeSlotEnd": "00:00",
                "nightTimeSlotEnd": "00:00",
                "morningTimeSlot": false,
                "afterNoonTimeSlot": false,
                "eveningTimeSlot": false,
                "nightTimeSlot": false
            },
            "wednesday": {
                "morningTimeSlotStart": "00:00",
                "afterNoonTimeSlotStart": "00:00",
                "eveningTimeSlotStart": "00:00",
                "nightTimeSlotStart": "00:00",
                "morningTimeSlotEnd": "00:00",
                "afterNoonTimeSlotEnd": "00:00",
                "eveningTimeSlotEnd": "00:00",
                "nightTimeSlotEnd": "00:00",
                "morningTimeSlot": false,
                "afterNoonTimeSlot": false,
                "eveningTimeSlot": false,
                "nightTimeSlot": false
            },
            "thursday": {
                "morningTimeSlotStart": "00:00",
                "afterNoonTimeSlotStart": "00:00",
                "eveningTimeSlotStart": "00:00",
                "nightTimeSlotStart": "00:00",
                "morningTimeSlotEnd": "00:00",
                "afterNoonTimeSlotEnd": "00:00",
                "eveningTimeSlotEnd": "00:00",
                "nightTimeSlotEnd": "00:00",
                "morningTimeSlot": false,
                "afterNoonTimeSlot": false,
                "eveningTimeSlot": false,
                "nightTimeSlot": false
            },
            "friday": {
                "morningTimeSlotStart": "00:00",
                "afterNoonTimeSlotStart": "00:00",
                "eveningTimeSlotStart": "00:00",
                "nightTimeSlotStart": "00:00",
                "morningTimeSlotEnd": "00:00",
                "afterNoonTimeSlotEnd": "00:00",
                "eveningTimeSlotEnd": "00:00",
                "nightTimeSlotEnd": "00:00",
                "morningTimeSlot": false,
                "afterNoonTimeSlot": false,
                "eveningTimeSlot": false,
                "nightTimeSlot": false
            },
            "saturday": {
                "morningTimeSlotStart": "00:00",
                "afterNoonTimeSlotStart": "00:00",
                "eveningTimeSlotStart": "00:00",
                "nightTimeSlotStart": "00:00",
                "morningTimeSlotEnd": "00:00",
                "afterNoonTimeSlotEnd": "00:00",
                "eveningTimeSlotEnd": "00:00",
                "nightTimeSlotEnd": "00:00",
                "morningTimeSlot": false,
                "afterNoonTimeSlot": false,
                "eveningTimeSlot": false,
                "nightTimeSlot": false
            }
        },
        "thresholdLimit": [
            {
                "role": "Admin",
                "incoming": 0,
                "inPreparation": 0,
                "completed": 0,
                "all": 0
            },
            {
                "role": "Receptionist",
                "incoming": 0,
                "inPreparation": 0,
                "completed": 0,
                "all": 0
            },
            {
                "role": "QA",
                "incoming": 0,
                "inPreparation": 0,
                "completed": 0,
                "all": 0
            },
            {
                "role": "Chef",
                "incoming": 0,
                "inPreparation": 0,
                "completed": 0,
                "all": 0
            }
        ],
        "alerts": {
            "Admin": {
                "changeColorToRed": false,
                "blinkColumn": false,
                "generateNotification": false,
                "playAlertSound": false
            },
            "Chef": {
                "changeColorToRed": false,
                "blinkColumn": false,
                "generateNotification": false,
                "playAlertSound": false
            },
            "Qa": {
                "changeColorToRed": false,
                "blinkColumn": false,
                "generateNotification": false,
                "playAlertSound": false
            },
            "Receptionist": {
                "changeColorToRed": false,
                "blinkColumn": false,
                "generateNotification": false,
                "playAlertSound": false
            }

        }
    }
}