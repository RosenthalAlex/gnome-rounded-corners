UUID=Rounded_Corners@lennart-k

zip:
	gnome-extensions pack --force \
		--extra-source=corners \
		--extra-source=README.md \
		--extra-source=LICENSE \
		--extra-source=CREDITS \
		--schema=schemas/org.gnome.shell.extensions.lennart-k.rounded_corners.gschema.xml \
		.
	mv "$(UUID).shell-extension.zip" "$(UUID).zip"

install: zip
	gnome-extensions install --force "$(UUID).zip"
