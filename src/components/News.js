import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import InfiniteScroll from "react-infinite-scroll-component";

export default class News extends Component {    
    constructor(){
        super();
        this.state = {
            articles: [],
            loading: true,
            page:1,
            totalResults: 0
        }
    }

    async updateNews() {
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({loading: true})
        let data = await fetch(url);
        let parsedData = await data.json();
        this.setState({articles: parsedData.articles, totalResults: parsedData.totalResults, loading: false})
    }
    async componentDidMount() {
        this.updateNews()
    }

    fetchMoreData = async ()=> {
        this.setState({page: this.state.page + 1})
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        let data = await fetch(url);
        let parsedData = await data.json();
        this.setState({articles: this.state.articles.concat(parsedData.articles), totalResults: parsedData.totalResults, loading: false})
    }
    
    render() {
        
        return (
            <>
                <h2 className='text-center'>NewsShorts - Top Headlines</h2>
                {this.state.loading && <Spinner/>}
                <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length !== this.state.totalResults}
                    loader={<Spinner/>}
                >
                <div className="container my-3">
                    <div className="row">
                        {this.state.articles.map((article)=> {
                            return <div className="col-md-3" key={article.url}>
                                <NewsItem title={article.title ? article.title.slice(0, 45): ''} description={article.description ? article.description.slice(0, 88) : ''} imageUrl={article.urlToImage} newsUrl={article.url} source={article.source.name} date={article.publishedAt}/>
                            </div>
                        })}
                    </div>
                </div>
                </InfiniteScroll>
            </>
        )
    }
}
