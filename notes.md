### Some Nest CLI commands

1. Create a new project     
   ```bash
   # create a new project with name: "projectName"
   nest new projectName

   # create a new project within the directory you are present in
   nest new .
   ```

2. Create a new module
   ```bash
   # create a new module with the name - 'messages'
   nest generate module messages
   ```
   The output of the above command will be a folder named 'messages' and a file within the folder with the name 'messages.module.ts'. This file will export a module named 'MessagesModule'.

   <code>Tip:</code> Donot create a module with name <code>messagesModule</code> as nest cli will automatically append <code>modules</code> to the name given in the command.

3. Create a new controller
   ```bash
   # create a new controller inside 'messages' folder with the name 'messages'.
   # '--flat' is a flag used when we donot want to create extra folder, here it will be - 'controllers'  
   nest generate controller messages/messages --flat
   ```
   <code>Tip:</code> Donot create a controller with name <code>messagesController</code> as nest cli will automatically append <code>controller</code> to the name given in the command.

### General pattern of nest command:
### nest generate (type of class to generate) (folder name/name of file) (flags)