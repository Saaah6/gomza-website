import re

with open('src/pages/index.astro', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Audio tag
old_audio = '<audio id="dobermanBark" src="/assets/dog_barking.ogg" autoplay style="display:none;"></audio>'
new_audio = '<audio id="dobermanBark" src="/assets/dog_barking.ogg" preload="none" style="display:none;"></audio>'
content = content.replace(old_audio, new_audio)

# 2. Update Script
old_script = '''      document.addEventListener('DOMContentLoaded', () => {
        const bark = document.getElementById('dobermanBark');
        if(bark) {
          bark.volume = 0.5;
          setTimeout(() => { bark.pause(); bark.currentTime = 0; }, 3000);
        }
      });'''

new_script = '''      document.addEventListener('DOMContentLoaded', () => {
        const bark = document.getElementById('dobermanBark');
        if(bark) {
          bark.volume = 0.5;
          const playAudio = () => {
            bark.play().catch(() => {});
            setTimeout(() => { bark.pause(); bark.currentTime = 0; }, 3000);
            document.removeEventListener('click', playAudio);
            document.removeEventListener('scroll', playAudio);
          };
          document.addEventListener('click', playAudio, { once: true });
          document.addEventListener('scroll', playAudio, { once: true });
        }
      });'''

content = content.replace(old_script, new_script)

with open('src/pages/index.astro', 'w', encoding='utf-8') as f:
    f.write(content)
