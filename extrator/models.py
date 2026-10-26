from django.db import models
from django.utils import timezone

class Pessoa(models.Model):
    TIPO_CHOICES = [
        ('FORNECEDOR', 'Fornecedor'),
        ('CLIENTE', 'Cliente'),
        ('FATURADO', 'Faturado'),
        ('CLIENTE-FORNECEDOR', 'Cliente-Fornecedor'),
    ]
    STATUS_CHOICES = [
        ('ATIVO', 'Ativo'),
        ('INATIVO', 'Inativo'),
    ]

    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='FORNECEDOR')
    razao_social = models.CharField('Razão Social / Nome', max_length=255)
    nome_fantasia = models.CharField('Nome Fantasia', max_length=255, blank=True, null=True)
    cpf_cnpj = models.CharField('CPF / CNPJ', max_length=25, db_index=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ATIVO')
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Pessoa'
        verbose_name_plural = 'Pessoas'
        ordering = ['razao_social']

    def __str__(self):
        return f"{self.razao_social} ({self.get_tipo_display()}) - {self.cpf_cnpj}"

    def inativar(self):
        self.status = 'INATIVO'
        self.save(update_fields=['status', 'atualizado_em'])

    def reativar(self):
        self.status = 'ATIVO'
        self.save(update_fields=['status', 'atualizado_em'])


class Classificacao(models.Model):
    TIPO_CHOICES = [
        ('DESPESA', 'Despesa'),
        ('RECEITA', 'Receita'),
    ]
    STATUS_CHOICES = [
        ('ATIVO', 'Ativo'),
        ('INATIVO', 'Inativo'),
    ]

    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES, default='DESPESA')
    descricao = models.CharField('Descrição da Classificação', max_length=150, db_index=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ATIVO')
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Classificação'
        verbose_name_plural = 'Classificações'
        ordering = ['descricao']

    def __str__(self):
        return f"{self.descricao} [{self.get_tipo_display()}]"

    def inativar(self):
        self.status = 'INATIVO'
        self.save(update_fields=['status', 'atualizado_em'])

    def reativar(self):
        self.status = 'ATIVO'
        self.save(update_fields=['status', 'atualizado_em'])


class MovimentoContas(models.Model):
    TIPO_CHOICES = [
        ('APAGAR', 'Contas a Pagar'),
        ('RECEBER', 'Contas a Receber'),
    ]
    STATUS_CHOICES = [
        ('ATIVO', 'Ativo'),
        ('INATIVO', 'Inativo'),
    ]

    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES, default='APAGAR')
    numero_documento = models.CharField('Número do Documento / NF', max_length=60, blank=True, null=True)
    descricao = models.TextField('Descrição dos Produtos / Serviços', blank=True, null=True)
    data_emissao = models.DateField('Data de Emissão', default=timezone.now)
    valor_total = models.DecimalField('Valor Total (R$)', max_digits=12, decimal_places=2, default=0.00)
    
    pessoa = models.ForeignKey(
        Pessoa,
        on_delete=models.PROTECT,
        related_name='movimentos',
        verbose_name='Fornecedor / Cliente'
    )
    faturado = models.ForeignKey(
        Pessoa,
        on_delete=models.PROTECT,
        related_name='movimentos_faturados',
        verbose_name='Faturado',
        null=True,
        blank=True
    )
    classificacoes = models.ManyToManyField(
        Classificacao,
        related_name='movimentos',
        verbose_name='Classificações (Despesas / Receitas)'
    )
    
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ATIVO')
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Movimento de Contas'
        verbose_name_plural = 'Movimentos de Contas'
        ordering = ['-data_emissao', '-id']

    def __str__(self):
        return f"{self.get_tipo_display()} #{self.id} - NF {self.numero_documento or 'S/N'} - R$ {self.valor_total}"

    def inativar(self):
        self.status = 'INATIVO'
        self.save(update_fields=['status', 'atualizado_em'])
        self.parcelas.update(status='INATIVO')

    def reativar(self):
        self.status = 'ATIVO'
        self.save(update_fields=['status', 'atualizado_em'])
        self.parcelas.update(status='ATIVO')


class ParcelaContas(models.Model):
    STATUS_CHOICES = [
        ('ATIVO', 'Ativo'),
        ('INATIVO', 'Inativo'),
    ]

    movimento = models.ForeignKey(
        MovimentoContas,
        on_delete=models.PROTECT,
        related_name='parcelas',
        verbose_name='Movimento Vinculado'
    )
    identificacao = models.CharField('Identificação Única da Parcela', max_length=100, unique=True)
    numero_parcela = models.PositiveIntegerField('Número da Parcela', default=1)
    valor = models.DecimalField('Valor da Parcela (R$)', max_digits=12, decimal_places=2)
    data_vencimento = models.DateField('Data de Vencimento')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ATIVO')
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Parcela de Conta'
        verbose_name_plural = 'Parcelas de Contas'
        ordering = ['movimento', 'numero_parcela']

    def __str__(self):
        return f"Parcela {self.numero_parcela} ({self.identificacao}) - R$ {self.valor} Venc: {self.data_vencimento}"

    def inativar(self):
        self.status = 'INATIVO'
        self.save(update_fields=['status', 'atualizado_em'])

    def reativar(self):
        self.status = 'ATIVO'
        self.save(update_fields=['status', 'atualizado_em'])
