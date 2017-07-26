#include <Windows.h>
/*
TODO:
	Can process PyList of inputs
	TrackPad support
	Trackball support
	Normalization of mouse positions according to screen sizes
	Return values standard
REMEMBER:
	Fill in all values for INPUT, irrespective of the type. Not doing so could put the
	computer to sleep.
*/

int TRACKPAD_HEIGHT, TRACKPAD_WIDTH;
bool TRACKPAD_INIT = false;


static PyObject* initTrackPad(PyObject* self, PyObject* args) {
	if (!PyArg_ParseTuple(args, "ii", &TRACKPAD_WIDTH, &TRACKPAD_HEIGHT)) {
		Py_RETURN_FALSE;
	}
	TRACKPAD_INIT = true;
	Py_RETURN_TRUE;
}

static PyObject* keyInput(PyObject* self, PyObject* args) {
	int keyc;
	const char *stroke;
	if (!PyArg_ParseTuple(args, "is", &keyc, &stroke)) {
		Py_RETURN_FALSE;
	}

	INPUT ip;
	ip.type = INPUT_KEYBOARD;
	ip.ki.time = 0;
	ip.ki.wScan = 0;
	ip.ki.wVk = keyc;
	ip.ki.dwExtraInfo = 0;

	if (!strcmp("press", stroke)) {
		ip.ki.dwFlags = KEYEVENTF_UNICODE;
		SendInput(1, &ip, sizeof(INPUT));

		ip.ki.dwFlags = KEYEVENTF_KEYUP;
		SendInput(1, &ip, sizeof(INPUT));
	}
	else if (!strcmp("down", stroke)) {
		ip.ki.dwFlags = KEYEVENTF_UNICODE;
		SendInput(1, &ip, sizeof(INPUT));
	}
	else if (!strcmp("up", stroke)) {
		ip.ki.dwFlags = KEYEVENTF_KEYUP;
		SendInput(1, &ip, sizeof(INPUT));
	}
	else {
		// Raise Exception.
		Py_RETURN_FALSE;
	}
	Py_RETURN_TRUE;
}

static PyObject* mouseClick(PyObject* self, PyObject* args) {
	const char *type, *button;
	if (!PyArg_ParseTuple(args, "ss", &button, &type)) {
		Py_RETURN_FALSE;
	}
	INPUT ip;
	ip.type = INPUT_MOUSE;
	ip.mi.time = 0;
	ip.mi.dx = 0;
	ip.mi.dy = 0;
	ip.mi.mouseData = 0;
	ip.mi.dwExtraInfo = 0;
	if (!strcmp(button,"left")) {
		if (!strcmp(type, "down")) {
			ip.mi.dwFlags = MOUSEEVENTF_LEFTDOWN;
		}
		else if (!strcmp(type, "up")) {
			ip.mi.dwFlags = MOUSEEVENTF_LEFTUP;
		}
		else
			Py_RETURN_FALSE;
	}
	else if(!strcmp(button,"right")){
		if (!strcmp(type, "down")) {
			ip.mi.dwFlags = MOUSEEVENTF_RIGHTDOWN;
		}
		else if (!strcmp(type, "up")) {
			ip.mi.dwFlags = MOUSEEVENTF_RIGHTUP;
		}
		else
			Py_RETURN_FALSE;
	}
	else if (!strcmp(button, "middle")) {
		if (!strcmp(type, "down")) {
			ip.mi.dwFlags = MOUSEEVENTF_MIDDLEDOWN;
		}
		else if (!strcmp(type, "up")) {
			ip.mi.dwFlags = MOUSEEVENTF_MIDDLEUP;
		}
		else
			Py_RETURN_FALSE;
	}
	else if (!strcmp(button, "wheel")) {
		ip.mi.dwFlags = MOUSEEVENTF_WHEEL;
		if (!strcmp(type, "up"))
			ip.mi.mouseData = WHEEL_DELTA;
		else if (!strcmp(type, "down"))
			ip.mi.mouseData = -WHEEL_DELTA;
		else
			Py_RETURN_FALSE;
	}
	else {
		printf("Invalid 'Type' input.");
		Py_RETURN_FALSE;
	}

	SendInput(1, &ip, sizeof(INPUT));

	Py_RETURN_TRUE;
}

static PyObject* trackPad(PyObject* self, PyObject* args){
	if (!TRACKPAD_INIT) {
		printf("Initialize Trackpad dimensions first.\nExiting...");
		Py_RETURN_TRUE;
	}

	int dx, dy;					// Co-ordinates (x,y)
	int X, Y;
	if (!PyArg_ParseTuple(args, "ii", &dx, &dy)) {
		Py_RETURN_FALSE;
	}

	X = dx * 65535 / TRACKPAD_WIDTH;
	Y = dy * 65535 / TRACKPAD_HEIGHT;

	INPUT ip;
	ip.type = INPUT_MOUSE;
	ip.mi.dwFlags = MOUSEEVENTF_MOVE | MOUSEEVENTF_ABSOLUTE;
	ip.mi.dx = X;
	ip.mi.dy = Y;

	ip.mi.mouseData = 0;
	ip.mi.dwExtraInfo = 0;
	ip.mi.time = 0;

	SendInput(1, &ip, sizeof(INPUT));
	
	Py_RETURN_TRUE;
}