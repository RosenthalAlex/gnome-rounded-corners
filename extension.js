import St from "gi://St"
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

const CORNERS = ['tl', 'tr', 'bl', 'br']

export default class RoundedCornersExtension extends Extension {
    enable() {
        this._corners = []
        this._settings = this.getSettings()
        this._settings.connectObject('changed::corner-radius', () => this._drawCorners(), this)
        // Fires after the layout manager has updated its monitor list.
        Main.layoutManager.connectObject('monitors-changed', () => this._drawCorners(), this)
        this._drawCorners()
    }

    disable() {
        Main.layoutManager.disconnectObject(this)
        this._settings?.disconnectObject(this)
        this._settings = null
        this._destroyCorners()
        this._corners = null
    }

    _drawCorners() {
        this._destroyCorners()

        const radius = this._settings.get_int('corner-radius')
        const cornerDir = this.dir.get_child('corners').get_path()

        for (const monitor of Main.layoutManager.monitors) {
            const size = (monitor.geometry_scale || 1) * radius

            for (const corner of CORNERS) {
                const x = monitor.x + (corner[1] === 'l' ? 0 : monitor.width - size)
                const y = monitor.y + (corner[0] === 't' ? 0 : monitor.height - size)

                const actor = new St.Bin({
                    style_class: `corner-decoration corner-${corner}`,
                    reactive: false,
                    can_focus: false,
                    track_hover: false,
                    x, y,
                    width: size,
                    height: size,
                    style: `
                        background-image: url("${cornerDir}/corner-${corner}.svg");
                        background-size: contain;
                    `,
                })

                Main.uiGroup.add_child(actor)
                this._corners.push(actor)
            }
        }
    }

    _destroyCorners() {
        for (const actor of this._corners ?? [])
            actor.destroy()
        this._corners = []
    }
}
