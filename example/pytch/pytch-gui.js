// pytch-gui.js

$(document).ready(function() {

    ////////////////////////////////////////////////////////////////////////////////
    //
    // Editor interaction

    let ace_editor = ace.edit("editor");


    ////////////////////////////////////////////////////////////////////////////////
    //
    // Skulpt interaction

    let builtinRead = (fname => {
        if (Sk.builtinFiles === undefined
                || Sk.builtinFiles["files"][fname] === undefined)
            throw Error(`File not found: '${fname}'`);

        return Sk.builtinFiles["files"][fname];
    });


    ////////////////////////////////////////////////////////////////////////////////
    //
    // Provide 'keyboard' interface via browser keyboard

    const browser_keyboard = (() => {
        let undrained_keydown_events = [];
        let key_is_down = {};

        const on_key_down = (e => {
            key_is_down[e.key] = true;
            undrained_keydown_events.push(e.key);
            e.preventDefault();
        });

        const on_key_up = (e => {
            key_is_down[e.key] = false;
            e.preventDefault();
        });

        const drain_new_keydown_events = () => {
            let evts = undrained_keydown_events;
            undrained_keydown_events = [];
            return evts;
        };

        const key_is_pressed = (keyname => (key_is_down[keyname] || false));

        return {
            on_key_down,
            on_key_up,
            key_is_pressed,
            drain_new_keydown_events,
        };
    })();


    ////////////////////////////////////////////////////////////////////////////////
    //
    // Connect Skulpt to our various interfaces

    Sk.configure({
        read: builtinRead,
    });
});
