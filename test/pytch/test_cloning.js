"use strict";

////////////////////////////////////////////////////////////////////////////////
//
// Cloning

describe("cloning", () => {
    it("can clone by instance", async () => {
        let import_result = await import_local_file("py/project/launch_clones.py");
        let project = import_result.$d.project.js_project;
        let alien_actor = project.actor_by_class_name("Alien");
        let all_aliens = () => alien_actor.instances;

        // Do not want to make assumptions about which order instances
        // get cloned, so sort the returned list of values of
        // attributes.
        const assert_all_attrs = (attrname, exp_values) => {
            let values = all_aliens().map(a => a.js_attr(attrname));
            values.sort((x, y) => (x - y));
            assert.deepStrictEqual(values, exp_values);
        };

        // The synthetic broadcast just puts the handler threads in the
        // queue; they don't run immediately.
        project.do_synthetic_broadcast("clone-self");
        assert_all_attrs("copied_id", [42]);
        assert_all_attrs("generated_id", [100]);

        // On the next frame the clones are created with the same state
        // as what they were cloned from.
        project.one_frame();
        assert_all_attrs("copied_id", [42, 42]);
        assert_all_attrs("generated_id", [100, 100]);

        // On the next frame they do their 'when start as clone' stuff:
        project.one_frame();
        assert_all_attrs("copied_id", [42, 43]);
        assert_all_attrs("generated_id", [100, 101]);

        // If we trigger another clone, we should eventually get another id-43
        // one, and also an id-44 one.
        project.do_synthetic_broadcast("clone-self");
        assert_all_attrs("copied_id", [42, 43]);
        assert_all_attrs("generated_id", [100, 101]);

        // On the next frame, clones are created, but their 'when start as
        // clone' handlers do not yet run.
        project.one_frame();
        assert_all_attrs("copied_id", [42, 42, 43, 43]);
        assert_all_attrs("generated_id", [100, 100, 101, 101]);

        // On this frame the 'when start as clone' handlers run.
        project.one_frame();
        assert_all_attrs("copied_id", [42, 43, 43, 44]);
        assert_all_attrs("generated_id", [100, 101, 102, 103]);
    });
});
