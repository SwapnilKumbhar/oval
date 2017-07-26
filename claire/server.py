'''
TODO:
	Serve page as per request, understand Directory structure...DONE
	Build Response headers...DONE
	frame Response with headers, keep in mind they will all be JSON
	Integrate with Doug.
'''
import socket
import threading
import time
import claire as cl

class Ovalserver():
	def __init__(self,host,port):
		self.HOST = host
		self.PORT = port
		self.SOCKET = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
		self.SOCKET.bind((host,port))

	def serve(self,sock):
		req = str(sock.recv(1024))
		print(req)
		resp = cl.claire(req).getResponse()
		# print(resp)
		# sock.send(bytes('HTTP/1.1 200 OK\r\nContent-Type=text/html\r\nContent-Length:5\r\n\r\nB0ii1','utf8'))
		# sock.send(bytes(resp,'utf8'))
		if resp is not None:
			sock.send(resp)
			print('----------')
		else:
			print('Null Request')
			print('----------')
		sock.close()
		return

	def start(self):
		self.SOCKET.listen(10)
		print('Socket Listening at port '+str(self.PORT))
		self.listen()

	def listen(self):
		while True:
			conn, addr = self.SOCKET.accept()
			# conn.send(bytes('HTTP/1.1 200 OK\r\nContent-Type=text/html\r\nContent-Length:5\r\n\r\nBOiii','utf8'))
			threading.Thread(target=self.serve,args=(conn,)).start()

Ovalserver('192.168.0.103',80).start()