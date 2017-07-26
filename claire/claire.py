'''
This module will be the main server. The caller module will only assign
each client a new thread and manage listening and accepting.
This module will provide the data with proper headers for the caller
module, which in turn will send it to the client.
'''
import os
import threading
import doug

class claire():
	HTML_FOLDER = 'html'
	HTML_FILE = 'index.html'
	PAGE_404 = 'lost.html'

	def __init__(self,request):
		self.PURE_REQUEST = request
		request = request[:len(request)]	# Remove final apostrophe 
		self.REQUEST = request[2:]			# Remove first "b'"
		try:
			self.REQUEST_PATH = self.HTML_FOLDER + request.split('\\r\\n')[0].split(' ')[1]
			self.REQUEST_METHOD = self.REQUEST.split('\\r\\n')[0].split(' ')[0]
		except Exception as e:
			print(self.REQUEST)

	def getResponse(self):
		try:
			print('Request for: '+self.REQUEST_PATH)
			print('Request Method: '+self.REQUEST_METHOD)
		except Exception as e:
			print('Exiting Thread...')
			return
		if self.REQUEST_METHOD == 'GET':
			if os.path.exists(self.REQUEST_PATH):
				print(self.REQUEST_PATH+': 200 OK')
				return self.buildResponse(200)
			else:
				print(self.REQUEST_PATH+': 404 Not Found')
				return self.buildResponse(404)
		elif self.REQUEST_METHOD == 'POST':			# For handling Post XHRs
			return self.postResponse()

	def buildResponse(self,code):	# Takes request code as parameter.
		if code == 404:
			target = self.HTML_FOLDER+'/'+self.PAGE_404
			head = b'HTTP/1.1 404 Not Found\r\nContent-Length:'+str(os.path.getsize(target)).encode()+b'\r\nServer:oval\r\n\r\n'
			resp = open(target,'rb').read()
			# print(head+resp)
			return head+resp
		elif code == 200:
			if self.REQUEST_PATH[len(self.REQUEST_PATH)-1]=='/':
				target = self.REQUEST_PATH + self.HTML_FILE
				head = b'HTTP/1.1 200 OK\r\nContent-Length: '+str(os.path.getsize(target)).encode()+b'\r\nServer:oval\r\n\r\n'
				resp = open(target,'rb').read()
				# print(head+resp)
				return head+resp
			else:
				target = self.REQUEST_PATH
				head = b'HTTP/1.1 200 OK\r\nContent-Length: '+str(os.path.getsize(target)).encode()+b'\r\nServer:oval\r\n\r\n'
				resp = open(target,'rb').read()
				# print(head + resp)
				return head+resp

	def postResponse(self):				# Get parsed request here.
		req = self.REQUEST.split('\\r\\n\\r\\n')[1].encode()
		req = req[:len(req)-1]
		parseReq = self.parseRequest()
		print(req)
		if 'Oval-Request' in parseReq and 'Oval-Type' in parseReq:
			rqs = str(req)
			rqs = rqs[2:]
			rqs = rqs[:len(rqs)-1]
			rqs = rqs.split('&')
			_post = {}
			for rq in rqs:
				rq = rq.split('=')
				_post[str(rq[0])]=rq[1]
			if parseReq['Oval-Type'] == 'kb':
				doug.keyInput(int(_post['keyc'],0),_post['stroke'])

		head = b'HTTP/1.1 200 OK\r\nContent-Length: '+str(len(req)).encode()+b'\r\nServer:oval\r\n\r\n'
		return head+req

	def parseRequest(self):
		req = self.REQUEST.split('\\r\\n')
		parsedReq = {}
		parsedReq['Method'] = req[0]
		for x in range(1,len(req)):
			lol = req[x].split(':')
			if len(lol) < 2:
				continue
			parsedReq[lol[0]] = lol[1].lstrip()
		print(parsedReq['Oval-Type'])
		return parsedReq
