# fanfare
Custom discord bot backend for playing a fanfare on request

Prerequisites:
	- nvm with node version 14 or higher recommended
	- python 2 (for discord opus dependency installation)
	- ffmpeg (requires manual installation and adding to "Path" environment variable on Windows)
	- (Windows only) node windows-buld-tools package installed globally (run npm install --global windows-build-tools)

After above dependencies are installed, run "npm ci" to install all packages

To run as service:
1. copy servicefile/fanfarebot.service to /etc/systemd/system/fanfarebot.service
2. Open /etc/systemd/system/fanfarebot.service in text editor
3. Edit the WorkingDirectory, ExecStart, and User to desired path and user.
4. run systemctl daemon-reload
5. run systemctl enable fanfarebot.service
6. run systemctl start fanfarebot.service
