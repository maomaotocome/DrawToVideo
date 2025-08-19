// ShipAny文档批量下载脚本
// 在浏览器控制台中运行此脚本

(function() {
    // 所有文档页面路径
    const pages = [
        // Get Started
        "",
        
        // Guide
        "guide/prerequisites", 
        "guide/whats-new",
        "guide/faq",
        
        // Features
        "features/database",
        "features/oauth", 
        "features/analytics",
        "features/i18n",
        "features/storage",
        "features/seo",
        "features/blog",
        "features/email",
        "features/email/resend",
        
        // Payment
        "payment/stripe",
        "payment/creem",
        "feedback",
        "affiliate", 
        "emails",
        
        // User Console
        "user-console/user-console",
        "user-console/new-table",
        "user-console/api-keys",
        "user-console/credits",
        
        // Admin System
        "admin-system/admin-config",
        "admin-system/admin-layout", 
        "admin-system/add-table",
        
        // AI Integrations
        "ai-integrations/image-generation",
        "ai-integrations/video-generation",
        "ai-integrations/text-generation",
        "ai-integrations/chat-completions",
        "ai-integrations/text-to-speech",
        
        // Components
        "components/header",
        "components/hero",
        "components/feature",
        "components/showcase",
        "components/pricing",
        "components/testimonial",
        "components/faq",
        "components/cta",
        "components/footer",
        
        // Deploy
        "deploy/deploy-to-vercel",
        "deploy/deploy-to-cloudflare", 
        "deploy/deploy-with-dokploy",
        
        // Tutorials
        "tutorials/customize-landing-page",
        "tutorials/new-page",
        "tutorials/new-components",
        "tutorials/api-call",
        "tutorials/edit-agreement"
    ];

    // Turndown转换器
    const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced'
    });

    let currentIndex = 0;
    const results = {};

    function convertCurrentPage() {
        const currentPath = window.location.pathname.replace('/en/', '').replace('/en', '');
        const content = document.querySelector('main') || document.querySelector('.content') || document.body;
        
        // 移除导航元素
        const clonedContent = content.cloneNode(true);
        const navs = clonedContent.querySelectorAll('nav, .nav, .sidebar, .menu');
        navs.forEach(nav => nav.remove());
        
        const markdown = turndownService.turndown(clonedContent);
        const filename = currentPath || 'index';
        
        results[filename] = {
            url: window.location.href,
            markdown: markdown,
            title: document.title
        };
        
        console.log(`✓ 已转换: ${filename}`);
        
        // 下载当前页面
        downloadMarkdown(filename, markdown);
    }

    function downloadMarkdown(filename, content) {
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename.replace('/', '_')}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function navigateToNext() {
        if (currentIndex < pages.length) {
            const nextPage = pages[currentIndex];
            const nextUrl = `https://docs.shipany.ai/en/${nextPage}`;
            console.log(`正在访问: ${nextUrl}`);
            window.location.href = nextUrl;
            currentIndex++;
        } else {
            console.log('所有页面转换完成!');
            // 下载汇总文件
            const summary = Object.keys(results).map(key => 
                `# ${results[key].title}\n\n来源: ${results[key].url}\n\n${results[key].markdown}`
            ).join('\n\n---\n\n');
            
            downloadMarkdown('shipany_docs_complete', summary);
        }
    }

    // 页面加载完成后转换
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', convertCurrentPage);
    } else {
        convertCurrentPage();
    }

    // 提供手动导航函数
    window.shipanyNext = navigateToNext;
    
    console.log('ShipAny文档转换脚本已加载');
    console.log('当前页面已转换并下载');
    console.log('运行 shipanyNext() 继续下一页');
})();