


FOR /L %%A IN (1,1,15) DO (
  START cmd.exe /k "node spoofClient.js"
)
