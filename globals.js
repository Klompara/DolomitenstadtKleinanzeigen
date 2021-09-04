
global.commands = [
    { command: '/auto', type: 'Auto' },
    { command: '/edvelektronik', type: 'EDV/Elektronik' },
    { command: '/freizeithobby', type: 'Freizeit/Hobby' },
    { command: '/garten', type: 'Garten' },
    { command: '/geraetemaschinen', type: 'Geräte/Maschinen' },
    { command: '/haushalt', type: 'Haushalt' },
    { command: '/immobilien', type: 'Immobilien' },
    { command: '/kind', type: 'Kind' },
    { command: '/kleidung', type: 'Kleidung' },
    { command: '/moebeleinrichtung', type: 'Möbel/Einrichtung' },
    { command: '/musik', type: 'Musik' },
    { command: '/sonstiges', type: 'Sonstiges' },
    { command: '/sport', type: 'Sport' },
    { command: '/tiere', type: 'Tiere' },
    { command: '/wissen', type: 'Wissen' },
];
global.messageSubscribeSuccess = `Glückwunsch, du hast dich Erfolgreich angemeldet!
Sag mir über welche Anzeigen du benachrichtigt werden willst. Schreibe einfach:
`
commands.forEach(command => {
    messageSubscribeSuccess += command.command + `
`;
});
messageSubscribeSuccess += `
Schreibe /stop um dich wieder abzumelden.
Mit /info kannst du deine Einstellungen und mit /help die Bedienungsanleitung ansehen.`
global.messageSubscribeAlready = `Du bist bereits Angemeldet! Schreibe /stop um dich wieder abzumelden.`
global.messageUnsubscribeSuccess = 'Glückwunsch, du hast dich Erfolgreich abgemeldet! Du wirst jetzt nicht mehr benachrichtig. Schreibe /start um dich wieder anzumelden.'
global.messageUnsubscribeAlready = 'Du bist noch nicht angemeldet! Schreibe /start um dich anzumelden.'
global.interestSubscribed = `Du wirst jetzt über <%interest%>-Kleinanzeigen benachrichtigt! Schreibe den gleichen Befehl nochmal um dich davon abzumelden.`
global.interestUnsubscribed = `Du wirst jetzt nicht mehr über <%interest%>-Kleinanzeigen benachrichtigt!`
global.infotext = `Du bekommst folgende Kleinanzeigen zugesendet:
<%interests%>

Momentane Anzahl von Kleinanzeigen: <%offerCount%>`;
global.msgHelp = `
/start um Benachrichtigungen über aktuelle Kleinanzeigen zu bekommen

/stop um keine Benachrichtigungen mehr zu bekommen

/alle um sich alle Kleinanzeigen-Typen anzumelden (achtung Spam)

/keine um sich von allen Kleinanzeigen-Typen abzumelden


Mit folgenden Befehlen kannst du dir die Kleinanzeigen-Typen auswählen, über die du benachrichtigt werden willst.

`
commands.forEach(command => {
    msgHelp += command.command + `
`;
});
msgHelp += `

Wenn du zum Beispiel für Immobilien Interesse hast, gib einfach /immobilien ein.
Wenn du dich wieder für einen Kleinanzeigen-Typ abmelden willst, gib den Befehl einfach nochmal ein.

Mit /info kannst du sehen, für welche Kleinanzeigen-Typen du dich angemeldet hast.`
global.allSubscribed = 'Du bekommst jetzt Benachrichtigungen von allen Kleinanzeigen'
global.allUnsubscribed = 'Du bekommst keine Benachrichtigungen mehr'
