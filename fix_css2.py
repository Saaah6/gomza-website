import os

with open('src/styles/global.css', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

clean_lines = lines[:1776]

correct_css = """}
@keyframes ctaGlow { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.08); opacity: 0.95; } }
.cta-bg-glow { animation: ctaGlow 2.8s ease-in-out infinite alternate; }
@keyframes beam1 { 0% { transform: translate(-260px, -30px) rotate(-4deg); } 100% { transform: translate(260px, -30px) rotate(6deg); } }
#beam-group-1 { animation: beam1 24s linear infinite; }
@keyframes beam2 { 0% { transform: translate(-320px, 20px) rotate(2deg); } 100% { transform: translate(320px, 20px) rotate(-4deg); } }
#beam-group-2 { animation: beam2 28s linear infinite; animation-delay: -8s; }
@keyframes beam3 { 0% { transform: translate(-280px, -10px) rotate(-2deg); } 100% { transform: translate(280px, -10px) rotate(3deg); } }
#beam-group-3 { animation: beam3 30s linear infinite; animation-delay: -15s; }
@keyframes heroFadeIn { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
"""
clean_lines.append(correct_css)

with open('src/styles/global.css', 'w', encoding='utf-8') as f:
    f.writelines(clean_lines)

print("Fixed CSS by line truncate!")
