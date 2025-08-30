import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://jidwyypecgmcqduzmdcv.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppZHd5d3BlY2dtY3FkdXptdmN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIyMzM5NywiZXhwIjoyMDcxNzk5Mzk3fQ.vMVQVJfhAvIF85bCtzFskEMeoOTgWDUYShzhfHIEZJM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function uploadDragonArenaMusic() {
  try {
    // Caminho para o arquivo Dragon Arena(1) no seu desktop
    const desktopPath = path.join(process.env.USERPROFILE || process.env.HOME, 'Desktop');
    const musicPath = path.join(desktopPath, 'Dragon Arena (1).mp3');
    
    console.log('🎵 Procurando música em:', musicPath);
    
    // Verificar se o arquivo existe
    if (!fs.existsSync(musicPath)) {
      console.error('❌ Arquivo não encontrado:', musicPath);
      console.log('📁 Arquivos no desktop:');
      const files = fs.readdirSync(desktopPath);
      files.filter(file => file.includes('Dragon') || file.includes('Arena') || file.endsWith('.mp3'))
            .forEach(file => console.log('  -', file));
      return;
    }
    
    // Ler o arquivo
    const fileBuffer = fs.readFileSync(musicPath);
    
    // Upload para o Supabase
    console.log('🚀 Fazendo upload da música...');
    const { data, error } = await supabase.storage
      .from('audio')
      .upload('musica4.mp3', fileBuffer, {
        contentType: 'audio/mpeg',
        upsert: true
      });
    
    if (error) {
      console.error('❌ Erro no upload:', error);
      return;
    }
    
    console.log('✅ Dragon Arena música enviada com sucesso!');
    console.log('📁 Arquivo salvo como: musica4.mp3');
    console.log('🎵 Agora vamos adicionar ao playlist...');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

uploadDragonArenaMusic();
