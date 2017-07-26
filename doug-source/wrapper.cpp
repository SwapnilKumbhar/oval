#ifndef _DEBUG
#define _DEBUG_WAS_DEFINED 1
#endif

#include <Python.h>

#ifndef _DEBUG_WAS_DEFINED
#define _DEBUG 1
#endif
#include "doug.h"

static PyMethodDef methods[] = {
	{"initTrackPad",(PyCFunction)initTrackPad,METH_VARARGS,"Set TrackPad Dimensions"},
	{"keyInput",(PyCFunction)keyInput,METH_VARARGS,"Trigger Keyboard Input with Keycode and stroke as arguements"},
	{"mouseClick",(PyCFunction)mouseClick,METH_VARARGS,"Trigger Mouse click with button and stroke as arguements" },
	{"trackPad",(PyCFunction)trackPad,METH_VARARGS,"TrackPad Interface"},
	{NULL,NULL,0,NULL},
};

static struct PyModuleDef doug = {
	PyModuleDef_HEAD_INIT,
	"doug",
	"Collection of methods for low level OS input manipulations.",
	-1,
	methods
};

PyMODINIT_FUNC PyInit_doug(void) {
	return PyModule_Create(&doug);
}
