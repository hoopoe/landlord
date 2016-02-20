require 'openssl'
OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE

require "google/api_client"
require "google_drive"

CLIENT_ID = ENV['GOOGLE_DRIVE_CLIENT_ID']
CLIENT_SECRET = ENV['GOOGLE_DRIVE_CLIENT_SECRET']

session = GoogleDrive.saved_session("api_gdrive_token.json",nil, CLIENT_ID, CLIENT_SECRET)
ws = session.spreadsheet_by_key("1FQLeGffcQq9ipQdRx7VA_ZeaW4l7FnHic384dhxcw2M").worksheets[0]

puts ws[1, 1]
