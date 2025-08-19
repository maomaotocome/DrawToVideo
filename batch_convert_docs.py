#!/usr/bin/env python3
"""
ShipAny文档批量转换工具
使用方法: python batch_convert_docs.py
"""

import requests
import html2text
import os
import time
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
import json

class ShipAnyDocsConverter:
    def __init__(self, base_url="https://docs.shipany.ai/en"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        
        # 配置html2text
        self.h = html2text.HTML2Text()
        self.h.ignore_links = False
        self.h.body_width = 0  # 不限制宽度
        self.h.unicode_snob = True
        
        # 创建输出目录
        os.makedirs('shipany_docs', exist_ok=True)

    def get_all_pages(self):
        """根据您提供的截图，手动定义所有页面"""
        return {
            # Get Started
            "get-started": "get-started",
            
            # Guide
            "guide/prerequisites": "guide/prerequisites", 
            "guide/whats-new": "guide/whats-new",
            "guide/faq": "guide/faq",
            
            # Features
            "features/database": "features/database",
            "features/oauth": "features/oauth", 
            "features/analytics": "features/analytics",
            "features/i18n": "features/i18n",
            "features/storage": "features/storage",
            "features/seo": "features/seo",
            "features/blog": "features/blog",
            "features/email": "features/email",
            "features/email/resend": "features/email/resend",
            
            # Payment
            "payment/stripe": "payment/stripe",
            "payment/creem": "payment/creem",
            "feedback": "feedback",
            "affiliate": "affiliate", 
            "emails": "emails",
            
            # User Console
            "user-console/user-console": "user-console/user-console",
            "user-console/new-table": "user-console/new-table",
            "user-console/api-keys": "user-console/api-keys",
            "user-console/credits": "user-console/credits",
            
            # Admin System
            "admin-system/admin-config": "admin-system/admin-config",
            "admin-system/admin-layout": "admin-system/admin-layout", 
            "admin-system/add-table": "admin-system/add-table",
            
            # AI Integrations
            "ai-integrations/image-generation": "ai-integrations/image-generation",
            "ai-integrations/video-generation": "ai-integrations/video-generation",
            "ai-integrations/text-generation": "ai-integrations/text-generation",
            "ai-integrations/chat-completions": "ai-integrations/chat-completions",
            "ai-integrations/text-to-speech": "ai-integrations/text-to-speech",
            
            # Components
            "components/header": "components/header",
            "components/hero": "components/hero",
            "components/feature": "components/feature",
            "components/showcase": "components/showcase",
            "components/pricing": "components/pricing",
            "components/testimonial": "components/testimonial",
            "components/faq": "components/faq",
            "components/cta": "components/cta",
            "components/footer": "components/footer",
            
            # Deploy
            "deploy/deploy-to-vercel": "deploy/deploy-to-vercel",
            "deploy/deploy-to-cloudflare": "deploy/deploy-to-cloudflare", 
            "deploy/deploy-with-dokploy": "deploy/deploy-with-dokploy",
            
            # Tutorials
            "tutorials/customize-landing-page": "tutorials/customize-landing-page",
            "tutorials/new-page": "tutorials/new-page",
            "tutorials/new-components": "tutorials/new-components",
            "tutorials/api-call": "tutorials/api-call",
            "tutorials/edit-agreement": "tutorials/edit-agreement"
        }

    def convert_page(self, page_path, filename):
        """转换单个页面"""
        url = urljoin(self.base_url, page_path)
        print(f"正在转换: {url}")
        
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            # 解析HTML并提取主要内容
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # 移除导航和其他不需要的元素
            for tag in soup.find_all(['nav', 'aside', 'footer', 'script', 'style']):
                tag.decompose()
            
            # 转换为markdown
            markdown_content = self.h.handle(str(soup))
            
            # 创建目录结构
            file_path = f"shipany_docs/{filename}.md"
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            
            # 写入文件
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(f"# {filename.replace('/', ' - ').title()}\n\n")
                f.write(f"来源: {url}\n\n")
                f.write(markdown_content)
            
            print(f"✓ 已保存: {file_path}")
            return True
            
        except Exception as e:
            print(f"✗ 转换失败 {url}: {e}")
            return False

    def convert_all(self):
        """批量转换所有页面"""
        pages = self.get_all_pages()
        successful = 0
        failed = 0
        
        for page_path, filename in pages.items():
            if self.convert_page(page_path, filename):
                successful += 1
            else:
                failed += 1
            
            # 避免请求过于频繁
            time.sleep(1)
        
        print(f"\n转换完成!")
        print(f"成功: {successful} 个页面")
        print(f"失败: {failed} 个页面")
        print(f"文件保存在: ./shipany_docs/")

    def create_index(self):
        """创建索引文件"""
        pages = self.get_all_pages()
        index_content = """# ShipAny 文档索引

本文档包含 ShipAny 项目的完整操作指南。

## 目录结构

"""
        
        current_section = ""
        for page_path, filename in pages.items():
            section = filename.split('/')[0] if '/' in filename else "主要文档"
            if section != current_section:
                index_content += f"\n## {section.title()}\n\n"
                current_section = section
            
            title = filename.split('/')[-1].replace('-', ' ').title()
            index_content += f"- [{title}](./{filename}.md)\n"
        
        with open('shipany_docs/README.md', 'w', encoding='utf-8') as f:
            f.write(index_content)
        
        print("✓ 已创建索引文件: shipany_docs/README.md")

if __name__ == "__main__":
    converter = ShipAnyDocsConverter()
    converter.convert_all()
    converter.create_index()