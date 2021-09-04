
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
Mit /info kannst du deine Einstellungen ansehen`
global.messageSubscribeAlready = `Du bist bereits Angemeldet! Schreibe /stop um dich wieder abzumelden.`
global.messageUnsubscribeSuccess = 'Glückwunsch, du hast dich Erfolgreich abgemeldet! Du wirst jetzt nicht mehr benachrichtig. Schreibe /start um dich wieder anzumelden.'
global.messageUnsubscribeAlready = 'Du bist noch nicht angemeldet! Schreibe /start um dich anzumelden.'
global.interestSubscribed = `Du wirst jetzt über <%interest%>-Kleinanzeigen benachrichtigt! Schreibe den gleichen Befehl nochmal um dich davon abzumelden.`
global.interestUnsubscribed = `Du wirst jetzt nicht mehr über <%interest%>-Kleinanzeigen benachrichtigt!`
global.infotext = `Du bekommst folgende Kleinanzeigen zugesendet:
<%interests%>

Momentane Anzahl von Kleinanzeigen: <%offerCount%>`;