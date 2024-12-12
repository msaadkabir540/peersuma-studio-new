# Available field types:
# 1. text 
# 2. video 
# 3. number  
# 4. user  
    
# Available functions:
# 1. getInputs usage example: getInputs("video","Intro Video") it is used to render field arg1: type of field arg2: label of field
# 2. GetLength usage example: GetLength("video1") it is used to get length of video

fields["video1"]=getInputs("video","Intro Video")
fields["video2"]=getInputs("video","Speech Video")
fields["text"]=getInputs("text","Video Text")
fields["name_Narr"]=getInputs("user","Drag the User here to add his name to the lower third or credit")

length_video1 = GetLength("video1")
length_video2 = GetLength("video2")

start_text = length_video1 + length_video2

length_text = start_text+2
