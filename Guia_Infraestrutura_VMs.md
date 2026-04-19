# Guia de Infraestrutura: Configurando as Máquinas Virtuais (VirtualBox)

Para que a arquitetura multicamada funcione perfeitamente, as três VMs precisam estar na mesma rede para se comunicarem.

## 1. Criando as Máquinas Virtuais
Você precisará de 3 VMs com Ubuntu instalado.
Para otimizar o uso do seu PC, recomendo:
*   **VM 1 (Banco de Dados):** Ubuntu Server (sem interface gráfica) - 1GB RAM.
*   **VM 2 (Backend):** Ubuntu Server (sem interface gráfica) - 1GB RAM.
*   **VM 3 (Frontend):** Ubuntu Desktop (com interface gráfica para testar o navegador) - 2GB a 4GB RAM.

## 2. Configurando a Rede no VirtualBox
*Com as VMs desligadas, faça o seguinte para CADA UMA das 3 VMs:*

1. Abra o VirtualBox, clique na VM e vá em **Configurações**.
2. Clique na aba **Rede**.
3. No "Adaptador 1", mude a opção "Conectado a:" de *NAT* para **Placa em modo Bridge** (ou *Bridged Adapter*).
4. No campo "Nome", escolha a placa de rede que está dando internet ao seu PC físico no momento (seja Wi-Fi ou Ethernet).
5. Clique em **OK**.

> **Por que Bridge?** O modo Bridge faz com que a sua VM ganhe um endereço IP no seu roteador físico, como se fosse um celular ou outro PC conectado na sua casa. Isso permite que elas acessem a internet (para baixar pacotes) e também se vejam pela rede local!

## 3. Descobrindo os IPs de cada VM
Ligue as 3 máquinas. Você precisará descobrir qual o IP que cada uma pegou.
Em cada VM, abra o terminal e digite:
```bash
ip addr
```
Procure pela placa de rede (geralmente `enp0s3` ou algo parecido) e anote o número ao lado de `inet` (ex: `192.168.1.15`).

**Anote para não esquecer:**
*   IP da VM 1 (Banco): ____________________ (Ex: 192.168.1.10)
*   IP da VM 2 (Backend): ____________________ (Ex: 192.168.1.11)
*   IP da VM 3 (Frontend): ____________________ (Ex: 192.168.1.12)

---

## Próximo Passo
Agora que a rede está pronta, você deve copiar as pastas de código para dentro das suas respectivas VMs e seguir os arquivos `instrucoes.md` que estão dentro de cada pasta!
