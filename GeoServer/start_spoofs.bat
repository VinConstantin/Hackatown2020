


FOR /L %%A IN (1,1,10) DO (
  START cmd.exe /k "node spoofClient.js"
)
