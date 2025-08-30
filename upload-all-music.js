import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = 'https://jidwywpecgmcqduzmvcv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppZHd5d3BlY2dtY3FkdXptdmN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIyMzM5NywiZXhwIjoyMDcxNzk5Mzk3fQ.vMVQVJfhAvIF85bCtzFskEMeoOTgWDUYShzhfHIEZJM'

const supabase = createClient(supabaseUrl, supabaseKey)

async function uploadMusic() {
  const files = [
    { local: 'public/musica3.mp3', remote: 'musica3.mp3' },
    { local: 'public/musica4.mp3', remote: 'musica4.mp3' },
    { local: 'public/musica5.mp3', remote: 'musica5.mp3' },
    { local: 'public/musica6.mp3', remote: 'musica6.mp3' }
  ]

  for (const file of files) {
    try {
      console.log(`Uploading ${file.local}...`)
      
      const fileBuffer = fs.readFileSync(file.local)
      
      const { data, error } = await supabase.storage
        .from('tracks')
        .upload(file.remote, fileBuffer, {
          contentType: 'audio/mpeg',
          upsert: true
        })

      if (error) {
        console.error(`Error uploading ${file.remote}:`, error)
      } else {
        console.log(`✅ ${file.remote} uploaded successfully!`)
      }
    } catch (err) {
      console.error(`Error reading ${file.local}:`, err)
    }
  }
}

uploadMusic()
