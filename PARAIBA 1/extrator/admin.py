from django.contrib import admin
from .models import Pessoa, Classificacao, MovimentoContas, ParcelaContas

@admin.register(Pessoa)
class PessoaAdmin(admin.ModelAdmin):
    list_display = ('razao_social', 'tipo', 'cpf_cnpj', 'status', 'criado_em')
    list_filter = ('tipo', 'status')
    search_fields = ('razao_social', 'cpf_cnpj', 'nome_fantasia')

@admin.register(Classificacao)
class ClassificacaoAdmin(admin.ModelAdmin):
    list_display = ('descricao', 'tipo', 'status', 'criado_em')
    list_filter = ('tipo', 'status')
    search_fields = ('descricao',)

class ParcelaContasInline(admin.TabularInline):
    model = ParcelaContas
    extra = 1

@admin.register(MovimentoContas)
class MovimentoContasAdmin(admin.ModelAdmin):
    list_display = ('id', 'tipo', 'numero_documento', 'pessoa', 'valor_total', 'data_emissao', 'status')
    list_filter = ('tipo', 'status', 'data_emissao')
    search_fields = ('numero_documento', 'pessoa__razao_social', 'descricao')
    inlines = [ParcelaContasInline]

@admin.register(ParcelaContas)
class ParcelaContasAdmin(admin.ModelAdmin):
    list_display = ('identificacao', 'movimento', 'numero_parcela', 'valor', 'data_vencimento', 'status')
    list_filter = ('status', 'data_vencimento')
    search_fields = ('identificacao', 'movimento__numero_documento')
