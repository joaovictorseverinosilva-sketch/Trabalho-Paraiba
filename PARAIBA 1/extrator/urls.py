from django.urls import path
from . import views

urlpatterns = [
    # Autenticação e Dashboard / Extração
    path('', views.login_page, name='login'),
    path('login.html', views.login_page, name='login_html'),
    path('api/auth/login/', views.api_auth_login, name='api_auth_login'),
    path('api/auth/logout/', views.api_auth_logout, name='api_auth_logout'),
    path('sistema/', views.index, name='index'),
    path('extrair/', views.extrair_dados, name='extrair_dados'),
    path('api/extract', views.extrair_dados, name='api_extract_v2'),
    path('api/status', views.api_status, name='api_status'),
    path('api/git-info/', views.git_info_api, name='git_info_api'),
    path('api/auxiliares/', views.auxiliares_api, name='auxiliares_api'),

    # 2ª ETAPA - Análise e Lançamento Automático
    path('api/etapa2/consultar/', views.consultar_entidades_api, name='consultar_entidades_api'),
    path('api/etapa2/lancar/', views.lancar_movimento_api, name='lancar_movimento_api'),

    # MANTER PESSOAS (Fornecedor, Cliente, Faturado)
    path('pessoas/', views.pessoas_view, name='pessoas_view'),
    path('api/pessoas/list/', views.pessoas_api_list, name='pessoas_api_list'),
    path('api/pessoas/save/', views.pessoas_api_save, name='pessoas_api_save'),
    path('api/pessoas/delete/<int:id>/', views.pessoas_api_delete, name='pessoas_api_delete'),
    path('api/pessoas/reativar/<int:id>/', views.pessoas_api_reativar, name='pessoas_api_reativar'),

    # MANTER CLASSIFICAÇÃO (Receitas e Despesas)
    path('classificacoes/', views.classificacoes_view, name='classificacoes_view'),
    path('api/classificacoes/list/', views.classificacoes_api_list, name='classificacoes_api_list'),
    path('api/classificacoes/save/', views.classificacoes_api_save, name='classificacoes_api_save'),
    path('api/classificacoes/delete/<int:id>/', views.classificacoes_api_delete, name='classificacoes_api_delete'),
    path('api/classificacoes/reativar/<int:id>/', views.classificacoes_api_reativar, name='classificacoes_api_reativar'),

    # REGISTRAR CONTAS (Contas a Pagar / Receber + Parcelas)
    path('contas/', views.contas_view, name='contas_view'),
    path('api/contas/list/', views.contas_api_list, name='contas_api_list'),
    path('api/contas/save/', views.contas_api_save, name='contas_api_save'),
    path('api/contas/delete/<int:id>/', views.contas_api_delete, name='contas_api_delete'),
    path('api/contas/reativar/<int:id>/', views.contas_api_reativar, name='contas_api_reativar'),
]
