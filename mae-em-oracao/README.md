# Mãe em Oração

Devocional diário para mães evangélicas, com leitura em áudio.

- `conteudo/devocionais.json`: os 7 devocionais da Semana 1 (fonte única do conteúdo).
- `conteudo/devocionais.md`: o mesmo texto em formato de leitura, para revisão.
- `prototipo/template.html`: protótipo do app (leitura, dias, progresso e player).
- `prototipo/index.html`: protótipo pronto, gerado pelo build.

Para regenerar depois de editar o JSON:

```
python3 mae-em-oracao/prototipo/build.py
```

O áudio do protótipo usa a voz do navegador (Web Speech API), só para teste.
No app final, cada devocional terá um MP3 gerado por voz de IA ou gravado por locutora.

Antes de publicar: confirmar a versão da Bíblia usada nos versículos e se ela permite uso comercial,
e pedir a revisão do conteúdo por um pastor ou líder.
