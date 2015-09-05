require 'rubygems'
require 'pushmeup'
GCM.host = 'https://android.googleapis.com/gcm/send'
GCM.format = :json
GCM.key = "AIzaSyDHk6Rtvap13bZC7NGZsL8Iq5KAZw04piA"
destination = ["APA91bERH_L1-J40rKz03IV8GkN3CJN4pbGDSEf8Wa8bp9NDRP0zaU7Bd3ZXAvsd5Rd9xdByY8aHJ7VYRydKzlJbND6NvQ2d_T0G_RigAGS3o8n59bqNGS3gzFRtqNPa8siMUPT5xQ9cG2GUBWOjHitb8F_0SJzAeQ"]
data = {:message => "First on kitaki!", :msgcnt => "1", :soundname => "beep.wav"}

GCM.send_notification( destination, data)
