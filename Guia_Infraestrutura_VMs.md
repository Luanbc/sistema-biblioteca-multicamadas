# Guia de Infraestrutura: Configurando as Máquinas Virtuais (VirtualBox)

Para que a arquitetura funcione perfeitamente, as duas VMs precisam estar na mesma rede para se comunicarem com a sua máquina local (host).

## 1. Criando as Máquinas Virtuais
Você precisará de 2 VMs com Ubuntu instalado.
Para otimizar o uso do seu PC, recomendo:
*   **VM 1 (Banco de Dados):** Ubuntu Server (sem interface gráfica) - 1GB RAM.
*   **VM 2 (Backend):** Ubuntu Server (sem interface gráfica) - 1GB a 2GB RAM.

*(Nota: O Frontend rodará diretamente na sua máquina física, sem precisar de uma terceira VM).*

## 2. Configurando a Rede no VirtualBox
*Com as VMs desligadas, faça o seguinte para CADA UMA das 2 VMs:*

1. Abra o VirtualBox, clique na VM e vá em **Configurações**.
2. Clique na aba **Rede**.
3. No "Adaptador 1", mude a opção "Conectado a:" de *NAT* para **Placa em modo Bridge** (ou *Bridged Adapter*).
4. No campo "Nome", escolha a placa de rede que está dando internet ao seu PC físico no momento (seja Wi-Fi ou Ethernet).
5. Clique em **OK**.

> **Por que Bridge?** O modo Bridge faz com que a sua VM ganhe um endereço IP no seu roteador físico, como se fosse um celular ou outro PC conectado na sua casa. Isso permite que elas acessem a internet (para baixar pacotes) e também fiquem acessíveis para a sua máquina física rodar o Frontend!

## 3. Descobrindo os IPs de cada VM
Ligue as 2 máquinas. Você precisará descobrir qual o IP que cada uma pegou.
Em cada VM, abra o terminal e digite:
```bash
ip addr
```
Procure pela placa de rede (geralmente `enp0s3` ou algo parecido) e anote o número ao lado de `inet` (ex: `192.168.1.15`).

**Anote para não esquecer:**
*   IP da VM 1 (Banco): ____________________ (Ex: 192.168.1.10)
*   IP da VM 2 (Backend): ____________________ (Ex: 192.168.1.11)

---

## Próximo Passo
Agora que a rede está pronta, volte para o arquivo `README.md` na raiz do projeto e siga as instruções para configurar o Banco de Dados, o Backend e o Frontend!
